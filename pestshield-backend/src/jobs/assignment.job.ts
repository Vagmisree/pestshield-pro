import { Worker } from 'bullmq';
import { prisma } from '../config/db.js';
import { assignmentQueue } from '../config/queue.js';
import { getDrivingMinutes } from '../integrations/googleMaps.js';
import { notifyTechnicianAssigned, notifyTechnicianJobCard } from '../modules/notifications/service.js';
import { logger } from '../utils/logger.js';
import { AUTO_ASSIGN_RADIUS_KM, TECHNICIAN_ACCEPT_TIMEOUT_MINUTES } from '../config/constants.js';
import { BookingStatus, TechnicianStatus } from '@prisma/client';
import type { AssignmentJobData } from '../config/queue.js';

const MAX_ATTEMPTS = 3;
const connection = { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 };

export const assignmentWorker = new Worker<AssignmentJobData>(
  'assignment-queue',
  async (job) => {
    const { bookingId, attempt = 1, skipTechnicianIds = [] } = job.data;
    logger.info(`[Assignment] Processing booking ${bookingId}, attempt ${attempt}`);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        customer: { include: { user: true } },
      },
    });

    if (!booking) {
      logger.warn(`[Assignment] Booking ${bookingId} not found`);
      return;
    }

    if (booking.status === BookingStatus.COMPLETED || booking.status === BookingStatus.CANCELLED) {
      logger.info(`[Assignment] Booking ${bookingId} already ${booking.status}, skipping`);
      return;
    }

    // ── Step 1: Find eligible technicians ──────────────────────────────────
    const candidates = await prisma.technician.findMany({
      where: {
        isActive: true,
        status: TechnicianStatus.AVAILABLE,
        skillTags: { has: booking.service.pestType },
        id: { notIn: skipTechnicianIds },
      },
    });

    if (candidates.length === 0) {
      logger.warn(`[Assignment] No available technicians for booking ${bookingId}`);
      if (attempt >= MAX_ATTEMPTS) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: BookingStatus.PENDING },
        });
        // TODO: Alert admin
      }
      return;
    }

    // ── Step 2: Filter by radius + score ───────────────────────────────────
    const bookingLat = 17.385; // TODO: geocode booking.address
    const bookingLng = 78.4867;

    const scored: Array<{ tech: typeof candidates[0]; score: number }> = [];

    for (const tech of candidates) {
      if (!tech.currentLat || !tech.currentLng) {
        scored.push({ tech, score: 999 });
        continue;
      }

      const drivingMins = await getDrivingMinutes(
        { lat: tech.currentLat, lng: tech.currentLng },
        { lat: bookingLat, lng: bookingLng }
      );

      // Count jobs today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const jobsToday = await prisma.booking.count({
        where: {
          technicianId: tech.id,
          slotDate: { gte: today },
          status: { in: [BookingStatus.TECHNICIAN_ASSIGNED, BookingStatus.IN_PROGRESS] },
        },
      });

      // Score = distance_minutes * 0.7 + current_jobs_today * 0.3
      const score = drivingMins * 0.7 + jobsToday * 0.3;
      scored.push({ tech, score });
    }

    // Sort by score ascending (lowest = best)
    scored.sort((a, b) => a.score - b.score);
    const best = scored[0];

    // ── Step 3: Check slot availability ────────────────────────────────────
    const slotDate = new Date(booking.slotDate);
    slotDate.setHours(0, 0, 0, 0);

    const existingSlot = await prisma.slot.findUnique({
      where: {
        technicianId_date_timeSlot: {
          technicianId: best.tech.id,
          date: slotDate,
          timeSlot: booking.slotTime,
        },
      },
    });

    if (existingSlot && !existingSlot.isAvailable) {
      // Try next candidate
      logger.info(`[Assignment] Best candidate ${best.tech.id} slot taken, trying next`);
      await assignmentQueue.add('assign', {
        bookingId,
        attempt,
        skipTechnicianIds: [...skipTechnicianIds, best.tech.id],
      });
      return;
    }

    // ── Step 4: Assign ─────────────────────────────────────────────────────
    await prisma.$transaction(async (tx) => {
      // Create/update slot
      await tx.slot.upsert({
        where: {
          technicianId_date_timeSlot: {
            technicianId: best.tech.id,
            date: slotDate,
            timeSlot: booking.slotTime,
          },
        },
        create: {
          technicianId: best.tech.id,
          date: slotDate,
          timeSlot: booking.slotTime,
          isAvailable: false,
          bookingId,
        },
        update: { isAvailable: false, bookingId },
      });

      // Update booking
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          technicianId: best.tech.id,
          status: BookingStatus.TECHNICIAN_ASSIGNED,
          assignedAt: new Date(),
        },
      });

      // Update technician status
      await tx.technician.update({
        where: { id: best.tech.id },
        data: { status: TechnicianStatus.ON_JOB },
      });
    });

    logger.info(`[Assignment] Technician ${best.tech.id} assigned to booking ${bookingId}`);

    // ── Step 5: Notify ─────────────────────────────────────────────────────
    const slotDateStr = booking.slotDate.toISOString().split('T')[0];

    await notifyTechnicianJobCard({
      phone: best.tech.phone,
      technicianName: best.tech.name,
      customerName: booking.customer.name,
      address: booking.address,
      pestType: booking.service.pestType,
      date: slotDateStr,
      slot: booking.slotTime,
      bookingRef: booking.bookingRef,
      recipientId: best.tech.id,
      bookingId,
    });

    await notifyTechnicianAssigned({
      phone: booking.customer.user.phone,
      customerName: booking.customer.name,
      technicianName: best.tech.name,
      technicianPhone: best.tech.phone,
      bookingRef: booking.bookingRef,
      date: slotDateStr,
      slot: booking.slotTime,
      recipientId: booking.customerId,
      bookingId,
    });

    // ── Step 6: Timeout job — reassign if not confirmed in 10 min ──────────
    await assignmentQueue.add(
      'timeout-check',
      { bookingId, attempt: attempt + 1, skipTechnicianIds: [...skipTechnicianIds, best.tech.id] },
      { delay: TECHNICIAN_ACCEPT_TIMEOUT_MINUTES * 60 * 1000, jobId: `timeout-${bookingId}` }
    );
  },
  { connection, concurrency: 5 }
);

assignmentWorker.on('failed', (job, err) => {
  logger.error(`[Assignment] Job ${job?.id} failed:`, err);
});
