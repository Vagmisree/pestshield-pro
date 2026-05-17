import { prisma } from '../config/db.js';
import { logger } from '../utils/logger.js';
import { NotificationChannel, NotificationStatus, UserRole } from '@prisma/client';

interface NotifyOptions {
  recipientId: string;
  recipientType: UserRole;
  bookingId?: string;
  channel: NotificationChannel;
  template: string;
  message: string;
  phone?: string;
  email?: string;
}

export async function mockNotify(opts: NotifyOptions): Promise<void> {
  const border = '─'.repeat(60);
  logger.info(`\n${border}`);
  logger.info(`📬 MOCK NOTIFICATION [${opts.channel}]`);
  logger.info(`   Template : ${opts.template}`);
  logger.info(`   To       : ${opts.phone || opts.email || opts.recipientId}`);
  logger.info(`   Message  : ${opts.message}`);
  logger.info(`${border}\n`);

  try {
    await prisma.notification.create({
      data: {
        recipientId: opts.recipientId,
        recipientType: opts.recipientType,
        bookingId: opts.bookingId,
        channel: opts.channel,
        templateName: opts.template,
        payload: { message: opts.message, phone: opts.phone, email: opts.email },
        status: NotificationStatus.SENT,
        sentAt: new Date(),
      },
    });
  } catch (err) {
    logger.warn('[MockNotify] Could not save notification record:', err);
  }
}
