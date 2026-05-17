import { Worker } from 'bullmq';
import { prisma } from '../config/db.js';
import { notifyReviewRequest, notifyContractRenewalDue, notifyDayOfReminder } from '../modules/notifications/service.js';
import { logger } from '../utils/logger.js';
import { UserRole } from '@prisma/client';
import type { FollowUpJobData } from '../config/queue.js';

const connection = { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 };

export const followUpWorker = new Worker<FollowUpJobData>(
  'follow-up-queue',
  async (job) => {
    const { type, bookingId, customerId } = job.data;
    logger.info(`[FollowUp] Processing ${type} for booking ${bookingId}`);

    if (type === 'REVIEW_REQUEST' && bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { customer: { include: { user: true } } },
      });
      if (!booking) return;

      // Skip if review already exists
      const existing = await prisma.review.findUnique({ where: { bookingId } });
      if (existing) return;

      await notifyReviewRequest({
        phone: booking.customer.user.phone,
        customerName: booking.customer.name,
        bookingRef: booking.bookingRef,
        reviewLink: `https://pestshieldpro.in/dashboard/bookings/${bookingId}/review`,
        recipientId: booking.customerId,
        bookingId,
      });
    }

    if (type === 'RENEWAL_REMINDER' && customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        include: { user: true },
      });
      if (!customer) return;

      await notifyContractRenewalDue({
        phone: customer.user.phone,
        customerName: customer.name,
        serviceType: customer.planType,
        daysRemaining: 30,
        recipientId: customerId,
      });
    }

    if (type === 'DAY_OF_REMINDER' && bookingId) {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          customer: { include: { user: true } },
          technician: { include: { user: true } },
          service: true,
        },
      });
      if (!booking) return;

      // Remind customer
      await notifyDayOfReminder({
        phone: booking.customer.user.phone,
        name: booking.customer.name,
        bookingRef: booking.bookingRef,
        service: booking.service.name,
        slot: booking.slotTime,
        role: UserRole.CUSTOMER,
        recipientId: booking.customerId,
        bookingId,
      });

      // Remind technician
      if (booking.technician) {
        await notifyDayOfReminder({
          phone: booking.technician.user.phone,
          name: booking.technician.name,
          bookingRef: booking.bookingRef,
          service: booking.service.name,
          slot: booking.slotTime,
          role: UserRole.TECHNICIAN,
          recipientId: booking.technicianId!,
          bookingId,
        });
      }
    }
  },
  { connection }
);

followUpWorker.on('failed', (job, err) => {
  logger.error(`[FollowUp] Job ${job?.id} failed:`, err);
});
