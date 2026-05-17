/**
 * WhatsApp Business API Integration (Interakt / Gupshup)
 * TODO: Implement in Part 2 (Notifications module)
 */

import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export async function sendWhatsAppMessage(phone: string, templateName: string, params: Record<string, string>) {
  if (!env.INTERAKT_API_KEY) {
    logger.warn(`[WhatsApp] Not configured — would send "${templateName}" to ${phone}`);
    return { success: false, reason: 'not_configured' };
  }

  // TODO: Implement Interakt/Gupshup API call
  logger.info(`[WhatsApp] Sending "${templateName}" to ${phone}`);
  return { success: true };
}
