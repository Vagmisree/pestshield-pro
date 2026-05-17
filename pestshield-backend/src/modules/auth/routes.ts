import { Router, type Router as RouterType } from 'express';
import * as authController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { authLimiter, otpLimiter } from '../../middleware/rateLimiter.js';
import {
  registerSchema,
  verifyOtpSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  sendBookingOtpSchema,
} from './schemas.js';

const router: RouterType = Router();

// ─── Public Routes ───────────────────────────────────────────────────────────

// Customer registration (sends OTP)
router.post(
  '/customer/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

// Verify OTP (completes registration)
router.post(
  '/customer/verify-otp',
  otpLimiter,
  validate(verifyOtpSchema),
  authController.verifyOtp
);

// Login (all roles)
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  authController.login
);

// Refresh access token
router.post(
  '/refresh',
  validate(refreshTokenSchema),
  authController.refresh
);

// Forgot password (sends OTP)
router.post(
  '/forgot-password',
  otpLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);

// Reset password (verifies OTP + updates)
router.post(
  '/reset-password',
  otpLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);

// ─── Protected Routes ────────────────────────────────────────────────────────

// Logout (requires auth)
router.post(
  '/logout',
  authenticate,
  authController.logout
);

// Send booking closure OTP (technician or admin only)
router.post(
  '/send-otp',
  authenticate,
  authorize('TECHNICIAN', 'ADMIN'),
  otpLimiter,
  validate(sendBookingOtpSchema),
  authController.sendBookingOtp
);

export default router;
