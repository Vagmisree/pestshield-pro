import rateLimit from 'express-rate-limit';
import { RATE_LIMIT_OTP, RATE_LIMIT_GENERAL, RATE_LIMIT_AUTH } from '../config/constants.js';

/**
 * General API rate limiter — 100 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: RATE_LIMIT_GENERAL.windowMs,
  max: RATE_LIMIT_GENERAL.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
  },
});

/**
 * Auth endpoints rate limiter — 20 requests per 15 minutes
 */
export const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_AUTH.windowMs,
  max: RATE_LIMIT_AUTH.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    code: 'AUTH_RATE_LIMIT_EXCEEDED',
  },
});

/**
 * OTP rate limiter — strict: 5 requests per hour per IP
 */
export const otpLimiter = rateLimit({
  windowMs: RATE_LIMIT_OTP.windowMs,
  max: RATE_LIMIT_OTP.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again after 1 hour.',
    code: 'OTP_RATE_LIMIT_EXCEEDED',
  },
});
