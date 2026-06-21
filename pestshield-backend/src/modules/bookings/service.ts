import bcrypt from 'bcrypt';
import { prisma } from '../../config/db.js';
import { redis } from '../../config/redis.js';
import { createError } from '../../middleware/errorHandler.js';
import { calculateTotal } from '../../utils/helpers.js';
import { generateBookingRef } from '../../utils/helpers.js';
import { GST_RATE, REDIS_KEYS } from '../../config/constants.js';
import { assignmentQueue } from '../../config/queue.js';
import { notifyBookingConfirmed } from '../notifications/service.js';
import { BookingStatus, PaymentStatus, PlanType } from '@prisma/client';
import type { CreateBookingInput, RescheduleInput, CancelInput, CloseBookingInput, BookingListQuery } from './schemas.js';
import { logger } from '../../utils/logger.js';
import { invoiceQueue, followUpQueue } from '../../config/queue.js';

// ─── Price Multipliers ───────────────────────────────────────────────────────

const PLAN_MULTIPLIER: Record<PlanType, number> = {
  SINGLE: 1.0,
  CONTRACT_RESIDENTIAL: 0.85,
  AMC_COMMERCIAL: 0.75,
};

// ─── Bulk Create Bookings ────────────────────────────────────────────────────

export async function bulkCreateBookings(customerId: string, bookings: CreateBookingInput[]) {
  const results = [];
  for (const b of bookings) {
    const booking = await createBooking(customerId, b);
    results.push({
      bookingRef: booking.bookingRef,
      bookingId: booking.bookingId,
      status: 'CONFIRMED',
    });
  }
  return results;
}

// ─── Check Pincode Serviceability ────────────────────────────────────────────

export async function checkPincode(pincode: string) {
  const branches = await prisma.branch.findMany({
    where: { serviceablePincodes: { has: pincode }, isActive: true },
    select: { id: true, city: true, state: true, address: true, phone: true },
  });
  return { available: branches.length > 0, branches };
}

// ─── Create Booking ──────────────────────────────────────────────────────────

export async function createBooking(customerId: string, input: CreateBookingInput) {
  // 1. Check pincode serviceability
  const { available } = await checkPincode(input.pincode);
  if (!available) {
    throw createError(`We don't service pincode ${input.pincode} yet`, 400, 'PINCODE_NOT_SERVICEABLE');
  }

  // 2. Get service
  const service = await prisma.serviceCatalogue.findUnique({ where: { id: input.serviceId } });
  if (!service || !service.isActive) {
    throw createError('Service not found or unavailable', 404, 'SERVICE_NOT_FOUND');
  }

  // 3. Calculate price
  const sqft = input.propertySize ? parseFloat(input.propertySize) : 0;
  const basePrice = service.basePrice + sqft * service.pricePerSqFt;
  const planMultiplier = PLAN_MULTIPLIER[input.planType];
  const priceAfterPlan = basePrice * planMultiplier;

  // 4. Apply coupon
  let discountAmount = 0;
  let couponId: string | undefined;
  if (input.couponCode) {
    const coupon = await prisma.coupon.findFirst({
      where: {
        code: input.couponCode,
        isActive: true,
        validFrom: { lte: new Date() },
        validUntil: { gte: new Date() },
      },
    });
    if (!coupon) throw createError('Invalid or expired coupon', 400, 'INVALID_COUPON');
    if (coupon.usedCount >= coupon.maxUses) throw createError('Coupon usage limit reached', 400, 'COUPON_EXHAUSTED');

    discountAmount = coupon.discountType === 'PERCENT'
      ? (priceAfterPlan * coupon.discountValue) / 100
      : coupon.discountValue;
    couponId = coupon.id;
  }

  const { gstAmount, totalAmount } = calculateTotal(priceAfterPlan, discountAmount, GST_RATE);

  // 5. Create booking
  const bookingRef = generateBookingRef();
  const slotDate = new Date(input.slotDate);

  const booking = await prisma.$transaction(async (tx) => {
    const b = await tx.booking.create({
      data: {
        bookingRef,
        customerId,
        serviceId: input.serviceId,
        planType: input.planType,
        propertyType: input.propertyType,
        propertySize: input.propertySize,
        address: input.address,
        pincode: input.pincode,
        city: input.city,
        slotDate,
        slotTime: input.slotTime,
        status: BookingStatus.CONFIRMED,
        notes: input.notes,
        couponId,
        baseAmount: priceAfterPlan,
        discountAmount,
        gstAmount,
        totalAmount,
        paymentStatus: PaymentStatus.PENDING,
      },
      include: { service: true, customer: { include: { user: true } } },
    });

    // Increment coupon usage
    if (couponId) {
      await tx.coupon.update({ where: { id: couponId }, data: { usedCount: { increment: 1 } } });
    }

    return b;
  });

  // 6. Trigger auto-assignment job
  await assignmentQueue.add('assign', { bookingId: booking.id, attempt: 1 }, { delay: 0 });

  // 7. Send confirmation notification
  try {
    await notifyBookingConfirmed({
      phone: booking.customer.user.phone,
      email: (booking.customer.user as { email?: string }).email,
      name: booking.customer.name,
      bookingRef: booking.bookingRef,
      service: booking.service.name,
      date: input.slotDate,
      slot: input.slotTime,
      amount: `₹${totalAmount.toFixed(2)}`,
      address: input.address,
      recipientId: booking.customerId,
      bookingId: booking.id,
    });
  } catch (err) {
    logger.warn('[Booking] Notification failed but booking created:', err);
  }

  return {
    bookingId: booking.id,
    bookingRef: booking.bookingRef,
    status: booking.status,
    amount: { base: priceAfterPlan, discount: discountAmount, gst: gstAmount, total: totalAmount },
  };
}

// ─── List Bookings ───────────────────────────────────────────────────────────

export async function listBookings(
  requesterId: string,
  requesterRole: string,
  query: BookingListQuery
) {
  const limit = Math.min(parseInt(query.limit), 50);
  const where: any = {};

  if (requesterRole === 'CUSTOMER') where.customerId = requesterId;
  if (requesterRole === 'TECHNICIAN') where.technicianId = requesterId;

  if (query.status) where.status = query.status;
  if (query.pincode) where.pincode = query.pincode;
  if (query.technicianId && requesterRole === 'ADMIN') where.technicianId = query.technicianId;
  if (query.dateFrom || query.dateTo) {
    where.slotDate = {};
    if (query.dateFrom) where.slotDate.gte = new Date(query.dateFrom);
    if (query.dateTo) where.slotDate.lte = new Date(query.dateTo);
  }
  if (query.cursor) where.id = { lt: query.cursor };

  const bookings = await prisma.booking.findMany({
    where,
    take: limit + 1,
    orderBy: { createdAt: 'desc' },
    include: {
      service: { select: { name: true, pestType: true } },
      technician: { select: { name: true, phone: true, avgRating: true } },
      report: { select: { status: true, severity: true } },
      payments: { select: { status: true, total: true } },
    },
  });

  const hasMore = bookings.length > limit;
  const items = hasMore ? bookings.slice(0, limit) : bookings;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return { items, nextCursor, hasMore };
}

// ─── Get Booking Detail ──────────────────────────────────────────────────────

export async function getBookingById(bookingId: string, requesterId: string, requesterRole: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: true,
      technician: { include: { user: { select: { phone: true } } } },
      customer: { include: { user: { select: { phone: true, email: true } } } },
      report: true,
      payments: true,
      notifications: { orderBy: { createdAt: 'desc' }, take: 20 },
      review: true,
    },
  });

  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');

  // Access control
  if (requesterRole === 'CUSTOMER' && booking.customerId !== requesterId) {
    throw createError('Access denied', 403, 'FORBIDDEN');
  }
  if (requesterRole === 'TECHNICIAN' && booking.technicianId !== requesterId) {
    throw createError('Access denied', 403, 'FORBIDDEN');
  }

  return booking;
}

// ─── Reschedule ──────────────────────────────────────────────────────────────

export async function rescheduleBooking(bookingId: string, customerId: string, input: RescheduleInput) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.customerId !== customerId) throw createError('Access denied', 403, 'FORBIDDEN');

  const cancellableStatuses: BookingStatus[] = [BookingStatus.CONFIRMED, BookingStatus.TECHNICIAN_ASSIGNED];
  if (!cancellableStatuses.includes(booking.status)) {
    throw createError('Booking cannot be rescheduled at this stage', 400, 'INVALID_STATUS');
  }

  // Must be at least 12 hours before slot
  const slotDateTime = new Date(booking.slotDate);
  const hoursUntilSlot = (slotDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
  if (hoursUntilSlot < 12) {
    throw createError('Cannot reschedule within 12 hours of the slot', 400, 'TOO_LATE_TO_RESCHEDULE');
  }

  // Free old slot
  if (booking.technicianId) {
    await prisma.slot.updateMany({
      where: { technicianId: booking.technicianId, bookingId: booking.id },
      data: { isAvailable: true, bookingId: null },
    });
  }

  const newSlotDate = new Date(input.slotDate);
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      slotDate: newSlotDate,
      slotTime: input.slotTime,
      status: BookingStatus.CONFIRMED,
      technicianId: null,
    },
  });

  // Re-run assignment
  await assignmentQueue.add('assign', { bookingId, attempt: 1 }, { delay: 0 });

  return updated;
}

// ─── Cancel ──────────────────────────────────────────────────────────────────

export async function cancelBooking(bookingId: string, requesterId: string, requesterRole: string, input: CancelInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { payments: { where: { status: 'SUCCESS' } } },
  });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');

  if (requesterRole === 'CUSTOMER' && booking.customerId !== requesterId) {
    throw createError('Access denied', 403, 'FORBIDDEN');
  }

  const nonCancellable: BookingStatus[] = [BookingStatus.COMPLETED, BookingStatus.CANCELLED];
  if (nonCancellable.includes(booking.status)) {
    throw createError('Booking cannot be cancelled', 400, 'INVALID_STATUS');
  }

  // Free technician slot
  if (booking.technicianId) {
    await prisma.slot.updateMany({
      where: { technicianId: booking.technicianId, bookingId },
      data: { isAvailable: true, bookingId: null },
    });
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELLED,
      cancelledAt: new Date(),
      cancelReason: input.reason,
    },
  });

  // Partial refund logic: if within 24 hrs of slot → 50% refund
  const hoursUntilSlot = (new Date(booking.slotDate).getTime() - Date.now()) / (1000 * 60 * 60);
  const paidPayment = booking.payments[0];
  if (paidPayment) {
    const refundAmount = hoursUntilSlot < 24 ? paidPayment.total * 0.5 : paidPayment.total;
    logger.info(`[Booking] Refund triggered: ₹${refundAmount} for booking ${bookingId}`);
    // Actual refund handled by payments module
  }

  return updated;
}

// ─── Approve Report ──────────────────────────────────────────────────────────

export async function approveReport(bookingId: string, customerId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { report: true, technician: { include: { user: true } } },
  });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.customerId !== customerId) throw createError('Access denied', 403, 'FORBIDDEN');
  if (booking.status !== BookingStatus.INSPECTION_DONE) {
    throw createError('No pending report to approve', 400, 'INVALID_STATUS');
  }

  await prisma.$transaction([
    prisma.inspectionReport.update({
      where: { bookingId },
      data: { status: 'APPROVED', approvedAt: new Date() },
    }),
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.IN_PROGRESS },
    }),
  ]);

  return { message: 'Report approved. Technician will begin service.' };
}

// ─── Close Booking (OTP) ─────────────────────────────────────────────────────

export async function closeBooking(bookingId: string, technicianId: string, input: CloseBookingInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      customer: { include: { user: true } },
      technician: true,
      service: true,
    },
  });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.technicianId !== technicianId) throw createError('Access denied', 403, 'FORBIDDEN');
  if (booking.status !== BookingStatus.IN_PROGRESS) {
    throw createError('Booking is not in progress', 400, 'INVALID_STATUS');
  }

  // Verify OTP from Redis
  const hashedOtp = await redis.get(REDIS_KEYS.OTP_BOOKING(bookingId));
  if (!hashedOtp) throw createError('OTP expired. Please request a new one.', 400, 'OTP_EXPIRED');

  const isValid = await bcrypt.compare(input.otp, hashedOtp);
  if (!isValid) throw createError('Invalid OTP', 400, 'INVALID_OTP');

  // Mark completed
  await prisma.$transaction(async (tx) => {
    await tx.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.COMPLETED, completedAt: new Date() },
    });
    // Free slot
    await tx.slot.updateMany({
      where: { technicianId, bookingId },
      data: { isAvailable: true },
    });
    // Update technician stats
    await tx.technician.update({
      where: { id: technicianId },
      data: { totalJobsCompleted: { increment: 1 }, status: 'AVAILABLE' },
    });
    // Audit log
    await tx.auditLog.create({
      data: {
        actorId: technicianId,
        actorRole: 'TECHNICIAN',
        action: 'BOOKING_CLOSED',
        entityType: 'Booking',
        entityId: bookingId,
        newValue: { status: 'COMPLETED', closedAt: new Date().toISOString() },
      },
    });
  });

  // Clean up OTP
  await redis.del(REDIS_KEYS.OTP_BOOKING(bookingId));

  // Trigger invoice generation + follow-up jobs
  await invoiceQueue.add('generate', { bookingId, paymentId: '' });
  await followUpQueue.add('review', { type: 'REVIEW_REQUEST', bookingId }, { delay: 2 * 60 * 60 * 1000 }); // 2 hours

  return { message: 'Booking closed successfully' };
}

// ─── Send Closure OTP ────────────────────────────────────────────────────────

export async function sendClosureOtp(bookingId: string, technicianId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: { include: { user: true } } },
  });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.technicianId !== technicianId) throw createError('Access denied', 403, 'FORBIDDEN');

  // Use MOCK_OTP in dev, otherwise generate random
  const otp = process.env.MOCK_OTP || Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Store in Redis with 10-minute TTL
  await redis.set(REDIS_KEYS.OTP_BOOKING(bookingId), hashedOtp, 'EX', 10 * 60);

  // Send via mock notification
  const { sendOtpSMS } = await import('../../integrations/msg91.js');
  const { sendWhatsApp } = await import('../../integrations/interakt.js');

  await sendOtpSMS(booking.customer.user.phone, otp);
  await sendWhatsApp({
    phone: booking.customer.user.phone,
    templateName: 'otp_delivery',
    variables: [otp, booking.bookingRef, '10'],
    bookingId,
    recipientId: booking.customerId,
  });

  logger.info(`[OTP] Closure OTP for booking ${booking.bookingRef}: ${otp} (dev log)`);
  return { message: 'OTP sent to customer for job closure verification' };
}

// ─── Mark Arrived ────────────────────────────────────────────────────────────

export async function markBookingArrived(bookingId: string, technicianId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.technicianId !== technicianId) throw createError('Access denied', 403, 'FORBIDDEN');

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: BookingStatus.IN_PROGRESS },
  });

  return { message: 'Arrival marked. Booking is now In Progress.' };
}
