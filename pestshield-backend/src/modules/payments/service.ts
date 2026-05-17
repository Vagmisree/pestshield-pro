import { prisma } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { createMockOrder, verifyMockPayment, initiateMockRefund } from '../../integrations/razorpay.js';
import { generateInvoicePDF } from '../../utils/pdf.js';
import { invoiceQueue, assignmentQueue } from '../../config/queue.js';
import { logger } from '../../utils/logger.js';
import { PaymentStatus, BookingStatus } from '@prisma/client';
import { notifyBookingConfirmed } from '../notifications/service.js';
import type { CreateOrderInput, VerifyPaymentInput, RefundInput } from './schemas.js';

// ─── Create Mock Order ────────────────────────────────────────────────────────

export async function createOrder(customerId: string, input: CreateOrderInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: { customer: true },
  });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.customerId !== customerId) throw createError('Access denied', 403, 'FORBIDDEN');
  if (booking.paymentStatus === PaymentStatus.SUCCESS) {
    throw createError('Booking already paid', 400, 'ALREADY_PAID');
  }

  const amountInPaise = Math.round(booking.totalAmount * 100);
  const order = await createMockOrder(amountInPaise, booking.bookingRef);

  // Upsert payment record
  const existing = await prisma.payment.findFirst({ where: { bookingId: booking.id } });
  if (existing) {
    await prisma.payment.update({
      where: { id: existing.id },
      data: { gatewayOrderId: order.id },
    });
  } else {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        customerId,
        amount: booking.baseAmount,
        gst: booking.gstAmount,
        total: booking.totalAmount,
        gatewayOrderId: order.id,
        status: PaymentStatus.PENDING,
      },
    });
  }

  return {
    orderId: order.id,
    razorpayOrderId: order.id,
    amount: amountInPaise,
    currency: 'INR',
    bookingRef: booking.bookingRef,
    bookingId: booking.id,
    // Mock key — frontend uses NEXT_PUBLIC_MOCK_PAYMENT=true to skip real Razorpay
    keyId: 'mock_key_id',
  };
}

// ─── Verify Mock Payment ──────────────────────────────────────────────────────

export async function verifyPayment(customerId: string, input: VerifyPaymentInput) {
  const isValid = verifyMockPayment(
    input.razorpayOrderId,
    input.razorpayPaymentId,
    input.razorpaySignature
  );
  if (!isValid) throw createError('Payment verification failed', 400, 'INVALID_PAYMENT');

  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: { customer: { include: { user: true } }, service: true },
  });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');

  // Update payment
  await prisma.payment.updateMany({
    where: { bookingId: input.bookingId, gatewayOrderId: input.razorpayOrderId },
    data: {
      gatewayPaymentId: input.razorpayPaymentId,
      gatewaySignature: input.razorpaySignature,
      status: PaymentStatus.SUCCESS,
    },
  });

  // Update booking
  await prisma.booking.update({
    where: { id: input.bookingId },
    data: { paymentStatus: PaymentStatus.SUCCESS, status: BookingStatus.CONFIRMED },
  });

  // Trigger auto-assignment
  await assignmentQueue.add('assign', { bookingId: input.bookingId, attempt: 1 }, { delay: 0 });

  // Send confirmation notification
  try {
    await notifyBookingConfirmed({
      phone: booking.customer.user.phone,
      name: booking.customer.name,
      bookingRef: booking.bookingRef,
      service: booking.service.name,
      date: booking.slotDate.toISOString().split('T')[0],
      slot: booking.slotTime,
      amount: `₹${booking.totalAmount.toFixed(2)}`,
      recipientId: booking.customerId,
      bookingId: booking.id,
    });
  } catch (err) {
    logger.warn('[Payment] Notification failed:', err);
  }

  // Queue invoice
  const paymentRecord = await prisma.payment.findFirst({ where: { bookingId: input.bookingId } });
  if (paymentRecord) {
    await invoiceQueue.add('generate', { bookingId: input.bookingId, paymentId: paymentRecord.id });
  }

  return { success: true, bookingRef: booking.bookingRef, message: 'Payment verified successfully.' };
}

// ─── Mock Refund ──────────────────────────────────────────────────────────────

export async function processRefund(input: RefundInput) {
  const payment = await prisma.payment.findFirst({
    where: { bookingId: input.bookingId, status: PaymentStatus.SUCCESS },
  });
  if (!payment) throw createError('No successful payment found', 404, 'PAYMENT_NOT_FOUND');
  if (!payment.gatewayPaymentId) throw createError('Payment ID missing', 400, 'INVALID_PAYMENT');

  const amountInPaise = Math.round(payment.total * 100);
  const refund = await initiateMockRefund(payment.gatewayPaymentId, amountInPaise, input.reason);

  await prisma.payment.update({
    where: { id: payment.id },
    data: { refundId: refund.id, refundStatus: 'initiated', status: PaymentStatus.REFUNDED },
  });

  return { refundId: refund.id, amount: payment.total, message: 'Refund initiated' };
}

// ─── Webhook (no-op for mock) ─────────────────────────────────────────────────

export async function handleWebhook(_event: string, _payload: unknown) {
  logger.info('[MockPayment] Webhook received — no-op in mock mode');
}

// ─── Get Invoice ──────────────────────────────────────────────────────────────

export async function getInvoice(bookingId: string, requesterId: string, requesterRole: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: { include: { user: true } },
      technician: true,
      service: true,
      payments: { where: { status: PaymentStatus.SUCCESS } },
    },
  });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (requesterRole === 'CUSTOMER' && booking.customerId !== requesterId) {
    throw createError('Access denied', 403, 'FORBIDDEN');
  }

  const payment = booking.payments[0];
  if (!payment) throw createError('No paid invoice found', 404, 'INVOICE_NOT_FOUND');

  // Generate HTML invoice
  const pdfBuffer = await generateInvoicePDF({
    invoiceNumber: `INV-${booking.bookingRef}`,
    bookingRef: booking.bookingRef,
    date: new Date().toLocaleDateString('en-IN'),
    customerName: booking.customer.name,
    customerPhone: booking.customer.user.phone,
    customerAddress: booking.address,
    serviceName: booking.service.name,
    technicianName: booking.technician?.name || 'TBD',
    paymentMethod: payment.method,
    baseAmount: booking.baseAmount,
    discountAmount: booking.discountAmount,
    gstAmount: booking.gstAmount,
    totalAmount: booking.totalAmount,
  });

  // Return as base64 data URL for local dev
  const base64 = pdfBuffer.toString('base64');
  return { invoiceUrl: `data:text/html;base64,${base64}`, bookingRef: booking.bookingRef };
}
