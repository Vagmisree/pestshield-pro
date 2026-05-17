import { mockNotify } from './mockNotifications.js';
import { UserRole, NotificationChannel } from '@prisma/client';

export async function sendOtpSMS(phone: string, otp: string): Promise<boolean> {
  await mockNotify({
    recipientId: phone,
    recipientType: UserRole.CUSTOMER,
    channel: NotificationChannel.SMS,
    template: 'otp',
    message: `Your PestShield OTP is: ${otp}. Valid for 10 minutes.`,
    phone,
  });
  return true;
}

export async function sendBookingSMS(
  phone: string,
  _bookingRef: string,
  message: string
): Promise<boolean> {
  await mockNotify({
    recipientId: phone,
    recipientType: UserRole.CUSTOMER,
    channel: NotificationChannel.SMS,
    template: 'booking_sms',
    message,
    phone,
  });
  return true;
}
