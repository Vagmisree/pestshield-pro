import { Queue } from 'bullmq';
import { prisma } from '../config/db.js';
import { followUpQueue, notificationQueue } from '../config/queue.js';
import { logger } from '../utils/logger.js';
import { BookingStatus } from '@prisma/client';

const connection = { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 };

/**
 * Daily 6 AM — Send day-of reminders to technicians
 */
export async function scheduleTechnicianReminders() {
  logger.info('[Scheduler] Running technician day-of reminders');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      slotDate: { gte: today, lt: tomorrow },
      status: BookingStatus.TECHNICIAN_ASSIGNED,
      technicianId: { not: null },
    },
    select: { id: true },
  });

  for (const b of bookings) {
    await followUpQueue.add('day-of-reminder', { type: 'DAY_OF_REMINDER', bookingId: b.id });
  }
  logger.info(`[Scheduler] Queued ${bookings.length} technician reminders`);
}

/**
 * Daily 9 AM — Send reminders to customers with today's bookings
 */
export async function scheduleCustomerReminders() {
  logger.info('[Scheduler] Running customer day-of reminders');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      slotDate: { gte: today, lt: tomorrow },
      status: { in: [BookingStatus.CONFIRMED, BookingStatus.TECHNICIAN_ASSIGNED] },
    },
    select: { id: true },
  });

  for (const b of bookings) {
    await followUpQueue.add('customer-reminder', { type: 'DAY_OF_REMINDER', bookingId: b.id });
  }
  logger.info(`[Scheduler] Queued ${bookings.length} customer reminders`);
}

/**
 * Weekly Sunday — Check contract customers due for next visit
 */
export async function scheduleContractVisitPrompts() {
  logger.info('[Scheduler] Checking contract customers for next visit');
  const contractCustomers = await prisma.customer.findMany({
    where: { planType: { in: ['CONTRACT_RESIDENTIAL', 'AMC_COMMERCIAL'] } },
    select: { id: true },
  });

  for (const c of contractCustomers) {
    const lastBooking = await prisma.booking.findFirst({
      where: { customerId: c.id, status: BookingStatus.COMPLETED },
      orderBy: { completedAt: 'desc' },
    });

    if (lastBooking?.completedAt) {
      const daysSinceLast = (Date.now() - lastBooking.completedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLast >= 85) { // ~3 months
        await followUpQueue.add('renewal-prompt', { type: 'RENEWAL_REMINDER', customerId: c.id });
      }
    }
  }
}

/**
 * Daily — Check contracts expiring in 30 days, alert admin
 */
export async function scheduleRenewalAlerts() {
  logger.info('[Scheduler] Checking contract renewals due in 30 days');
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiring = await prisma.coupon.findMany({
    where: {
      validUntil: { lte: thirtyDaysFromNow, gte: new Date() },
      isActive: true,
    },
  });

  logger.info(`[Scheduler] ${expiring.length} coupons/contracts expiring in 30 days`);
  // TODO: Alert admin via notification
}

/**
 * Register all cron jobs using BullMQ repeat
 */
export async function registerCronJobs() {
  const cronQueue = new Queue('cron-jobs', { connection });

  await cronQueue.add('technician-reminders', {}, { repeat: { pattern: '0 6 * * *' } });
  await cronQueue.add('customer-reminders', {}, { repeat: { pattern: '0 9 * * *' } });
  await cronQueue.add('contract-prompts', {}, { repeat: { pattern: '0 10 * * 0' } }); // Sunday 10 AM
  await cronQueue.add('renewal-alerts', {}, { repeat: { pattern: '0 8 * * *' } });

  logger.info('[Scheduler] Cron jobs registered');
}
