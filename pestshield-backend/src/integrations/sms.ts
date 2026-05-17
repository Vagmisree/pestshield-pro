/**
 * MSG91 SMS Integration
 * TODO: Implement in Part 2 (Notifications module)
 */

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export async function sendSMS(phone: string, message: string) {
  if (!env.MSG91_AUTH_KEY) {
    logger.warn(`[SMS] Not configured — would send to ${phone}: "${message}"`);
    return { success: false, reason: 'not_configured' };
  }

  // TODO: Implement MSG91 API call
  logger.info(`[SMS] Sending to ${phone}`);
  return { success: true };
}

export async function sendOtpSMS(phone: string, otp: string) {
  if (!env.MSG91_AUTH_KEY || !env.MSG91_TEMPLATE_ID_OTP) {
    logger.warn(`[SMS] OTP not configured — would send OTP to ${phone}`);
    return { success: false, reason: 'not_configured' };
  }

  // TODO: Implement MSG91 OTP template send
  logger.info(`[SMS] OTP sent to ${phone}`);
  return { success: true };
}
