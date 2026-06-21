import { NotificationChannel, UserRole, NotificationStatus } from '@prisma/client';
import { prisma as db } from '../config/db.js';
import { logger } from '../utils/logger.js';

export interface WhatsAppMessage {
  phone: string;           // format: 91XXXXXXXXXX (no + sign)
  templateName: string;
  variables: string[];
  bookingId?: string;
  recipientId?: string;
  recipientType?: UserRole;
}

export async function sendWhatsApp(opts: WhatsAppMessage): Promise<boolean> {
  const apiKey = process.env.INTERAKT_API_KEY;

  // If no API key set, fall back to console log (dev mode)
  if (!apiKey) {
    logger.info('[WhatsApp MOCK]', { template: opts.templateName, to: opts.phone, vars: opts.variables });
    await logNotification(opts, 'MOCK_SENT');
    return true;
  }

  try {
    const response = await fetch('https://api.interakt.ai/v1/public/message/', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countryCode: '+91',
        phoneNumber: opts.phone.replace(/^91/, ''), // Interakt wants without country code
        callbackData: `pestshield_${opts.templateName}_${Date.now()}`,
        type: 'Template',
        template: {
          name: opts.templateName,
          languageCode: 'en',
          bodyValues: opts.variables,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      logger.error('[WhatsApp FAILED]', { template: opts.templateName, phone: opts.phone, error: result });
      await logNotification(opts, 'FAILED');
      return false;
    }

    logger.info('[WhatsApp SENT]', { template: opts.templateName, phone: opts.phone });
    await logNotification(opts, 'SENT');
    return true;

  } catch (err) {
    logger.error('[WhatsApp ERROR]', { error: err });
    await logNotification(opts, 'FAILED');
    return false;
  }
}

async function logNotification(opts: WhatsAppMessage, status: string) {
  try {
    await db.notification.create({
      data: {
        recipientId: opts.recipientId || opts.phone,
        recipientType: opts.recipientType || UserRole.CUSTOMER,
        channel: NotificationChannel.WHATSAPP,
        templateName: opts.templateName,
        message: opts.variables.join(' | '),
        status: status === 'SENT' ? NotificationStatus.SENT : status === 'MOCK_SENT' ? NotificationStatus.SENT : NotificationStatus.FAILED,
        sentAt: status !== 'FAILED' ? new Date() : undefined,
        bookingId: opts.bookingId,
      },
    });
  } catch { /* non-critical */ }
}
