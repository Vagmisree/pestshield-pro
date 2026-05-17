// ─── Application Constants ───────────────────────────────────────────────────

export const APP_NAME = 'PestShield Pro';
export const APP_VERSION = '1.0.0';

// ─── Auth ────────────────────────────────────────────────────────────────────

export const BCRYPT_SALT_ROUNDS = 12;
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;
export const ACCESS_TOKEN_EXPIRY = '15m';
export const REFRESH_TOKEN_EXPIRY_DAYS = 7;
export const REFRESH_TOKEN_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds

// ─── Business Rules ──────────────────────────────────────────────────────────

export const GST_RATE = 0.18; // 18%
export const TECHNICIAN_ACCEPT_TIMEOUT_MINUTES = 10;
export const AUTO_ASSIGN_RADIUS_KM = 15;
export const CONTRACT_FREE_SERVICE_INTERVAL = 4; // Every 4th service is free
export const BOOKING_REF_PREFIX = 'PSP';

// ─── Rate Limiting ───────────────────────────────────────────────────────────

export const RATE_LIMIT_OTP = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 requests per hour per IP
};

export const RATE_LIMIT_GENERAL = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min
};

export const RATE_LIMIT_AUTH = {
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 auth attempts per 15 min
};

// ─── Pagination ──────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// ─── File Upload ─────────────────────────────────────────────────────────────

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// ─── Redis Key Prefixes ──────────────────────────────────────────────────────

export const REDIS_KEYS = {
  REFRESH_TOKEN: (userId: string) => `refresh_token:${userId}`,
  OTP_BOOKING: (bookingId: string) => `otp:booking:${bookingId}`,
  OTP_LOGIN: (phone: string) => `otp:login:${phone}`,
  OTP_VERIFY: (phone: string) => `otp:verify:${phone}`,
  TEMP_REGISTRATION: (token: string) => `temp_reg:${token}`,
  RATE_LIMIT: (key: string) => `rate_limit:${key}`,
} as const;
