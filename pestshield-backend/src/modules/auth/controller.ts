import { Request, Response, NextFunction } from 'express';
import * as authService from './service.js';
import type {
  RegisterInput,
  VerifyOtpInput,
  LoginInput,
  RefreshTokenInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  SendBookingOtpInput,
} from './schemas.js';

/**
 * POST /api/auth/customer/register
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as RegisterInput;
    const result = await authService.registerCustomer(input);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/customer/verify-otp
 */
export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { tempToken, otp } = req.body as VerifyOtpInput;
    const result = await authService.verifyRegistrationOtp(tempToken, otp);

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as LoginInput;
    const result = await authService.login(input);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/refresh
 */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body as RefreshTokenInput;
    const result = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const result = await authService.logout(userId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/forgot-password
 */
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { phone } = req.body as ForgotPasswordInput;
    const result = await authService.forgotPassword(phone);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/reset-password
 */
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const input = req.body as ResetPasswordInput;
    const result = await authService.resetPassword(input);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/send-otp (booking closure OTP)
 */
export async function sendBookingOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const { bookingId } = req.body as SendBookingOtpInput;
    const result = await authService.sendBookingOtp(bookingId);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
