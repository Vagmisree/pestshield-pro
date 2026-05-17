import { Worker } from 'bullmq';
import { prisma } from '../config/db.js';
import { generateInvoicePDF } from '../utils/pdf.js';
import { uploadToS3, buildS3Key } from '../integrations/s3.js';
import { sendEmail } from '../integrations/sendgrid.js';
import { logger } from '../utils/logger.js';
import { PaymentStatus } from '@prisma/client';
import type { InvoiceJobData } from '../config/queue.js';

const connection = { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 };

export const invoiceWorker = new Worker<InvoiceJobData>(
  'invoice-queue',
  async (job) => {
    const { bookingId } = job.data;
    logger.info(`[Invoice] Generating for booking ${bookingId}`);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: { include: { user: true } },
        technician: true,
        service: true,
        payments: { where: { status: PaymentStatus.SUCCESS } },
      },
    });

    if (!booking || !booking.payments[0]) {
      logger.warn(`[Invoice] No paid payment for booking ${bookingId}`);
      return;
    }

    const payment = booking.payments[0];
    if (payment.invoiceUrl) {
      logger.info(`[Invoice] Already generated for ${bookingId}`);
      return;
    }

    const pdfBuffer = await generateInvoicePDF({
      invoiceNumber: `INV-${booking.bookingRef}`,
      bookingRef: booking.bookingRef,
      date: new Date().toLocaleDateString('en-IN'),
      customerName: booking.customer.name,
      customerPhone: booking.customer.user.phone,
      customerAddress: booking.address,
      customerGstin: booking.customer.gstin || undefined,
      serviceName: booking.service.name,
      technicianName: booking.technician?.name || 'N/A',
      paymentMethod: payment.method,
      baseAmount: booking.baseAmount,
      discountAmount: booking.discountAmount,
      gstAmount: booking.gstAmount,
      totalAmount: booking.totalAmount,
    });

    const key = buildS3Key('invoices', `${booking.bookingRef}.html`);
    const url = await uploadToS3(pdfBuffer, key, 'text/html');

    if (url) {
      await prisma.payment.update({ where: { id: payment.id }, data: { invoiceUrl: url } });
      logger.info(`[Invoice] Uploaded: ${url}`);

      // Email invoice
      if (booking.customer.user.email) {
        await sendEmail({
          to: booking.customer.user.email,
          subject: `Invoice for ${booking.bookingRef} — PestShield Pro`,
          dynamicData: {
            customerName: booking.customer.name,
            bookingRef: booking.bookingRef,
            invoiceUrl: url,
            amount: `₹${booking.totalAmount.toFixed(2)}`,
          },
        });
      }
    }
  },
  { connection }
);

invoiceWorker.on('failed', (job, err) => {
  logger.error(`[Invoice] Job ${job?.id} failed:`, err);
});
