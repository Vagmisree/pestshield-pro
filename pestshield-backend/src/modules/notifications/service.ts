import { sendWhatsApp } from '../../integrations/interakt.js';
import { sendOtpSMS, sendBookingSMS } from '../../integrations/msg91.js';
import { sendEmail } from '../../integrations/sendgrid.js';
import { sendPushNotification } from '../../integrations/firebase.js';
import { logger } from '../../utils/logger.js';
import { UserRole } from '@prisma/client';

// ─── WhatsApp Templates ──────────────────────────────────────────────────────

export async function notifyBookingConfirmed(opts: {
  phone: string; name: string; bookingRef: string;
  service: string; date: string; slot: string;
  amount: string; recipientId: string; bookingId: string;
}) {
  await sendWhatsApp({
    phone: opts.phone,
    templateName: 'booking_confirmed',
    variables: [opts.name, opts.bookingRef, opts.service, opts.date, opts.slot, opts.amount],
    bookingId: opts.bookingId,
    recipientId: opts.recipientId,
    recipientType: UserRole.CUSTOMER,
  });
  await sendEmail({
    to: opts.phone, // replace with actual email when available
    subject: `Booking Confirmed — ${opts.bookingRef}`,
    dynamicData: opts,
  });
}

export async function notifyTechnicianAssigned(opts: {
  phone: string; customerName: string; technicianName: string;
  technicianPhone: string; bookingRef: string; date: string;
  slot: string; recipientId: string; bookingId: string;
}) {
  await sendWhatsApp({
    phone: opts.phone,
    templateName: 'technician_assigned',
    variables: [opts.customerName, opts.technicianName, opts.technicianPhone, opts.date, opts.slot],
    bookingId: opts.bookingId,
    recipientId: opts.recipientId,
    recipientType: UserRole.CUSTOMER,
  });
}

export async function notifyTechnicianJobCard(opts: {
  phone: string; technicianName: string; customerName: string;
  address: string; pestType: string; date: string; slot: string;
  bookingRef: string; recipientId: string; bookingId: string;
}) {
  await sendWhatsApp({
    phone: opts.phone,
    templateName: 'technician_job_card',
    variables: [opts.technicianName, opts.customerName, opts.address, opts.pestType, opts.date, opts.slot, opts.bookingRef],
    bookingId: opts.bookingId,
    recipientId: opts.recipientId,
    recipientType: UserRole.TECHNICIAN,
  });
}

export async function notifyTechnicianArrived(opts: {
  phone: string; customerName: string; technicianName: string;
  recipientId: string; bookingId: string;
}) {
  await sendWhatsApp({
    phone: opts.phone,
    templateName: 'technician_arrived',
    variables: [opts.customerName, opts.technicianName],
    bookingId: opts.bookingId,
    recipientId: opts.recipientId,
    recipientType: UserRole.CUSTOMER,
  });
}

export async function notifyReportReady(opts: {
  phone: string; customerName: string; bookingRef: string;
  reportLink: string; recipientId: string; bookingId: string;
}) {
  await sendWhatsApp({
    phone: opts.phone,
    templateName: 'report_ready',
    variables: [opts.customerName, opts.bookingRef, opts.reportLink],
    bookingId: opts.bookingId,
    recipientId: opts.recipientId,
    recipientType: UserRole.CUSTOMER,
  });
}

export async function notifyServiceCompleted(opts: {
  phone: string; customerName: string; bookingRef: string;
  invoiceUrl: string; recipientId: string; bookingId: string;
}) {
  await sendWhatsApp({
    phone: opts.phone,
    templateName: 'service_completed',
    variables: [opts.customerName, opts.bookingRef, opts.invoiceUrl],
    bookingId: opts.bookingId,
    recipientId: opts.recipientId,
    recipientType: UserRole.CUSTOMER,
  });
}

export async function notifyReviewRequest(opts: {
  phone: string; customerName: string; bookingRef: string;
  reviewLink: string; recipientId: string; bookingId: string;
}) {
  await sendWhatsApp({
    phone: opts.phone,
    templateName: 'review_request',
    variables: [opts.customerName, opts.bookingRef, opts.reviewLink],
    bookingId: opts.bookingId,
    recipientId: opts.recipientId,
    recipientType: UserRole.CUSTOMER,
  });
}

export async function notifyOtpDelivery(opts: {
  phone: string; otp: string; bookingRef: string;
  recipientId: string; bookingId: string;
}) {
  // Primary: WhatsApp
  const waOk = await sendWhatsApp({
    phone: opts.phone,
    templateName: 'otp_delivery',
    variables: [opts.otp, opts.bookingRef, '10'],
    bookingId: opts.bookingId,
    recipientId: opts.recipientId,
    recipientType: UserRole.CUSTOMER,
  });
  // Fallback: SMS
  if (!waOk) {
    await sendOtpSMS(opts.phone, opts.otp);
  }
}

export async function notifyContractRenewalDue(opts: {
  phone: string; customerName: string; serviceType: string;
  daysRemaining: number; recipientId: string;
}) {
  await sendWhatsApp({
    phone: opts.phone,
    templateName: 'contract_renewal_due',
    variables: [opts.customerName, opts.serviceType, String(opts.daysRemaining)],
    recipientId: opts.recipientId,
    recipientType: UserRole.CUSTOMER,
  });
}

export async function notifyDayOfReminder(opts: {
  phone: string; name: string; bookingRef: string;
  service: string; slot: string; role: UserRole;
  recipientId: string; bookingId: string;
}) {
  await sendWhatsApp({
    phone: opts.phone,
    templateName: 'service_reminder',
    variables: [opts.name, opts.bookingRef, opts.service, opts.slot],
    bookingId: opts.bookingId,
    recipientId: opts.recipientId,
    recipientType: opts.role,
  });
}

export async function sendTechnicianPush(opts: {
  deviceToken: string; title: string; body: string;
  data?: Record<string, string>;
}) {
  await sendPushNotification({
    deviceToken: opts.deviceToken,
    title: opts.title,
    body: opts.body,
    data: opts.data,
  });
}
