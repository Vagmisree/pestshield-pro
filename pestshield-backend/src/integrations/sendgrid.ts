import nodemailer from 'nodemailer';
import { prisma as db } from '../config/db.js';
import { NotificationChannel, UserRole, NotificationStatus } from '@prisma/client';
import { logger } from '../utils/logger.js';

// Gmail SMTP transporter
// IMPORTANT: Use Gmail App Password — NOT your real Gmail password
// To get: Google Account → Security → 2-Step Verification (ON) → App Passwords → Mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_SENDER,       // enterprisesshreeji382@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD, // 16-character app password from Google
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  dynamicData?: Record<string, unknown>;
  recipientId?: string;
  templateId?: string; // kept for backward compat
}

export async function sendEmail(opts: EmailOptions): Promise<boolean> {
  const sender = process.env.GMAIL_SENDER;

  if (!sender || !process.env.GMAIL_APP_PASSWORD) {
    logger.info('[Email MOCK]', { to: opts.to, subject: opts.subject });
    return true;
  }

  // Build HTML from dynamicData if no explicit html passed
  const html = opts.html || buildFallbackHtml(opts.subject, opts.dynamicData);

  try {
    const info = await transporter.sendMail({
      from: `"PestShield Pro 🦟" <${sender}>`,
      to: opts.to,
      subject: opts.subject,
      html,
    });

    logger.info('[Email SENT]', { to: opts.to, messageId: info.messageId });

    // Log to DB
    try {
      await db.notification.create({
        data: {
          recipientId: opts.recipientId || opts.to,
          recipientType: UserRole.CUSTOMER,
          channel: NotificationChannel.EMAIL,
          templateName: opts.subject,
          message: opts.subject,
          status: NotificationStatus.SENT,
          sentAt: new Date(),
        },
      });
    } catch { /* non-critical */ }

    return true;
  } catch (err) {
    logger.error('[Email FAILED]', { to: opts.to, error: err });
    return false;
  }
}

// Branded HTML email template (used when no custom HTML passed)
function buildFallbackHtml(subject: string, data?: Record<string, unknown>): string {
  const frontendUrl = process.env.FRONTEND_URL || 'https://pestshieldpro.in';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 2px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#16a34a,#059669);padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0;">🦟 PestShield Pro</h1>
              <p style="color:#d1fae5;font-size:14px;margin:8px 0 0;">India's Most Trusted Pest Control Platform</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 40px;">
              <h2 style="color:#111827;font-size:20px;font-weight:600;margin:0 0 16px;">${subject}</h2>
              ${data ? Object.entries(data).map(([k, v]) => `
                <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f3f4f6;">
                  <span style="color:#6b7280;font-size:14px;text-transform:capitalize;">${k.replace(/([A-Z])/g, ' $1')}</span>
                  <span style="color:#111827;font-size:14px;font-weight:500;">${v}</span>
                </div>
              `).join('') : ''}
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <a href="${frontendUrl}/dashboard"
                style="display:inline-block;background:#16a34a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 32px;border-radius:12px;">
                View Your Booking →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #f3f4f6;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                PestShield Pro · Hyderabad, India<br>
                📞 +91 7981353130 · ✉️ enterprisesshreeji382@gmail.com<br><br>
                <a href="${frontendUrl}/privacy-policy" style="color:#9ca3af;">Privacy Policy</a> &nbsp;|&nbsp;
                <a href="${frontendUrl}/refund-policy" style="color:#9ca3af;">Refund Policy</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
