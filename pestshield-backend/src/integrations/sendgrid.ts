import { mockNotify } from './mockNotifications.js';
import { UserRole, NotificationChannel } from '@prisma/client';

export interface EmailOptions {
  to: string;
  subject: string;
  templateId?: string;
  dynamicData?: Record<string, unknown>;
  html?: string;
  recipientId?: string;
}

export async function sendEmail(opts: EmailOptions): Promise<boolean> {
  await mockNotify({
    recipientId: opts.recipientId || opts.to,
    recipientType: UserRole.CUSTOMER,
    channel: NotificationChannel.EMAIL,
    template: opts.subject,
    message: `Subject: ${opts.subject} | Data: ${JSON.stringify(opts.dynamicData || {}).slice(0, 200)}`,
    email: opts.to,
  });
  return true;
}
