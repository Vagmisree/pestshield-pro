import crypto from 'crypto';
import { BOOKING_REF_PREFIX, OTP_LENGTH } from '../config/constants.js';

/**
 * Generate a 6-digit numeric OTP
 */
export function generateOTP(): string {
  const otp = crypto.randomInt(100000, 999999).toString();
  return otp;
}

/**
 * Generate a human-readable booking reference
 * Format: PSP-2026-001234
 */
export function generateBookingRef(): string {
  const year = new Date().getFullYear();
  const random = crypto.randomInt(100000, 999999).toString();
  return `${BOOKING_REF_PREFIX}-${year}-${random}`;
}

/**
 * Calculate GST amount
 */
export function calculateGST(amount: number, rate: number = 0.18): number {
  return Math.round(amount * rate * 100) / 100;
}

/**
 * Calculate total with GST
 */
export function calculateTotal(baseAmount: number, discount: number = 0, gstRate: number = 0.18): {
  baseAmount: number;
  discountAmount: number;
  gstAmount: number;
  totalAmount: number;
} {
  const afterDiscount = baseAmount - discount;
  const gstAmount = calculateGST(afterDiscount, gstRate);
  const totalAmount = Math.round((afterDiscount + gstAmount) * 100) / 100;

  return {
    baseAmount,
    discountAmount: discount,
    gstAmount,
    totalAmount,
  };
}

/**
 * Generate a random token (for temp registration tokens, etc.)
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Mask phone number for display: 91****3210
 */
export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone;
  return phone.slice(0, 2) + '****' + phone.slice(-4);
}

/**
 * Parse pagination params
 */
export function parsePagination(page?: string | number, limit?: string | number) {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
}
