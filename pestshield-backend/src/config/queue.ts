import { Queue, Worker, QueueEvents } from 'bullmq';
import { redis } from './redis.js';
import { logger } from '../utils/logger.js';

const connection = { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 };

// ─── Queue Definitions ───────────────────────────────────────────────────────

export const assignmentQueue = new Queue('assignment-queue', { connection });
export const notificationQueue = new Queue('notification-queue', { connection });
export const invoiceQueue = new Queue('invoice-queue', { connection });
export const followUpQueue = new Queue('follow-up-queue', { connection });

// ─── Queue Event Logging ─────────────────────────────────────────────────────

[assignmentQueue, notificationQueue, invoiceQueue, followUpQueue].forEach((q) => {
  const events = new QueueEvents(q.name, { connection });
  events.on('failed', ({ jobId, failedReason }) => {
    logger.error(`[Queue:${q.name}] Job ${jobId} failed: ${failedReason}`);
  });
  events.on('completed', ({ jobId }) => {
    logger.debug(`[Queue:${q.name}] Job ${jobId} completed`);
  });
});

// ─── Job Type Definitions ────────────────────────────────────────────────────

export interface AssignmentJobData {
  bookingId: string;
  attempt?: number;
  skipTechnicianIds?: string[];
}

export interface NotificationJobData {
  recipientId: string;
  recipientPhone: string;
  recipientEmail?: string;
  channel: 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PUSH';
  templateName: string;
  variables: Record<string, string>;
  bookingId?: string;
  deviceToken?: string;
}

export interface InvoiceJobData {
  bookingId: string;
  paymentId: string;
}

export interface FollowUpJobData {
  type: 'REVIEW_REQUEST' | 'RENEWAL_REMINDER' | 'DAY_OF_REMINDER';
  bookingId?: string;
  customerId?: string;
  technicianId?: string;
}
