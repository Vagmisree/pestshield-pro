import { Worker } from 'bullmq';
import { sendWhatsApp } from '../integrations/interakt.js';
import { sendOtpSMS } from '../integrations/msg91.js';
import { sendEmail } from '../integrations/sendgrid.js';
import { sendPushNotification } from '../integrations/firebase.js';
import { logger } from '../utils/logger.js';
import { UserRole } from '@prisma/client';
import type { NotificationJobData } from '../config/queue.js';

const connection = { host: process.env.REDIS_HOST || 'localhost', port: Number(process.env.REDIS_PORT) || 6379 };

export const notificationWorker = new Worker<NotificationJobData>(
  'notification-queue',
  async (job) => {
    const { channel, recipientPhone, recipientEmail, templateName, variables, bookingId, recipientId, deviceToken } = job.data;
    logger.info(`[Notification] ${channel} → ${templateName} for ${recipientId}`);

    switch (channel) {
      case 'WHATSAPP':
        await sendWhatsApp({
          phone: recipientPhone,
          templateName,
          variables: Object.values(variables),
          bookingId,
          recipientId,
          recipientType: UserRole.CUSTOMER,
        });
        break;

      case 'SMS':
        await sendOtpSMS(recipientPhone, variables.otp || '');
        break;

      case 'EMAIL':
        if (recipientEmail) {
          await sendEmail({
            to: recipientEmail,
            subject: variables.subject || 'PestShield Pro Notification',
            dynamicData: variables,
          });
        }
        break;

      case 'PUSH':
        if (deviceToken) {
          await sendPushNotification({
            deviceToken,
            title: variables.title || 'PestShield Pro',
            body: variables.body || '',
            data: variables,
          });
        }
        break;
    }
  },
  { connection, concurrency: 10 }
);

notificationWorker.on('failed', (job, err) => {
  logger.error(`[Notification] Job ${job?.id} failed:`, err);
});
