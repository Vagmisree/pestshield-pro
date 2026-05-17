import { mockNotify } from './mockNotifications.js';
import { UserRole, NotificationChannel } from '@prisma/client';

export interface PushNotification {
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  recipientId?: string;
  bookingId?: string;
}

export async function sendPushNotification(push: PushNotification): Promise<boolean> {
  await mockNotify({
    recipientId: push.recipientId || push.deviceToken,
    recipientType: UserRole.TECHNICIAN,
    bookingId: push.bookingId,
    channel: NotificationChannel.PUSH,
    template: push.title,
    message: push.body,
  });
  return true;
}
