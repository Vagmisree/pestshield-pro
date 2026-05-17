import { mockNotify } from './mockNotifications.js';
import { UserRole, NotificationChannel } from '@prisma/client';

export interface WhatsAppMessage {
  phone: string;
  templateName: string;
  variables: string[];
  bookingId?: string;
  recipientId?: string;
  recipientType?: UserRole;
}

export async function sendWhatsApp(opts: WhatsAppMessage): Promise<boolean> {
  const message = `[WhatsApp:${opts.templateName}] ${opts.variables.join(' | ')}`;
  await mockNotify({
    recipientId: opts.recipientId || opts.phone,
    recipientType: opts.recipientType || UserRole.CUSTOMER,
    bookingId: opts.bookingId,
    channel: NotificationChannel.WHATSAPP,
    template: opts.templateName,
    message,
    phone: opts.phone,
  });
  return true;
}
