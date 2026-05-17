import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db.js';
import { redis, setWithExpiry, getKey, deleteKey } from '../../config/redis.js';
import { env } from '../../config/env.js';
import {
  BCRYPT_SALT_ROUNDS,
  OTP_EXPIRY_MINUTES,
  REFRESH_TOKEN_EXPIRY_SECONDS,
  REDIS_KEYS,
} from '../../config/constants.js';
import { generateOTP, generateToken } from '../../utils/helpers.js';
import { createError } from '../../middleware/errorHandler.js';
import { UserRole } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import type {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
} from './schemas.js';

// ─── Token Generation ────────────────────────────────────────────────────────

function generateAccessToken(userId: string, role: UserRole): string {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as string & {},
  } as jwt.SignOptions);
}

function generateRefreshToken(userId: string, role: UserRole): string {
  return jwt.sign({ userId, role }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as string & {},
  } as jwt.SignOptions);
}

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerCustomer(input: RegisterInput) {
  const { name, phone, email, password } = input;

  // Check if phone already exists
  const existingUser = await prisma.user.findUnique({ where: { phone } });
  if (existingUser) {
    throw createError('Phone number already registered', 409, 'PHONE_EXISTS');
  }

  // Check email if provided
  if (email) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw createError('Email already registered', 409, 'EMAIL_EXISTS');
    }
  }

  // Generate OTP
  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Store registration data temporarily in Redis
  const tempToken = generateToken();
  const tempData = JSON.stringify({
    name,
    phone,
    email,
    passwordHash: await bcrypt.hash(password, BCRYPT_SALT_ROUNDS),
    otp: hashedOtp,
  });

  await setWithExpiry(
    REDIS_KEYS.TEMP_REGISTRATION(tempToken),
    tempData,
    OTP_EXPIRY_MINUTES * 60
  );

  // TODO: Send OTP via MSG91
  logger.info(`[AUTH] OTP generated for registration: ${phone} → ${otp} (dev only)`);

  return { tempToken, message: 'OTP sent to your phone number' };
}

// ─── Verify OTP (Complete Registration) ──────────────────────────────────────

export async function verifyRegistrationOtp(tempToken: string, otp: string) {
  const tempData = await getKey(REDIS_KEYS.TEMP_REGISTRATION(tempToken));
  if (!tempData) {
    throw createError('Registration session expired. Please register again.', 400, 'SESSION_EXPIRED');
  }

  const { name, phone, email, passwordHash, otp: hashedOtp } = JSON.parse(tempData);

  // Verify OTP
  const isValid = await bcrypt.compare(otp, hashedOtp);
  if (!isValid) {
    throw createError('Invalid OTP', 400, 'INVALID_OTP');
  }

  // Create User + Customer in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        phone,
        email: email || undefined,
        passwordHash,
        role: UserRole.CUSTOMER,
        isVerified: true,
        isActive: true,
      },
    });

    const customer = await tx.customer.create({
      data: {
        userId: user.id,
        name,
      },
    });

    return { user, customer };
  });

  // Generate tokens
  const accessToken = generateAccessToken(result.user.id, UserRole.CUSTOMER);
  const refreshToken = generateRefreshToken(result.user.id, UserRole.CUSTOMER);

  // Store refresh token in Redis
  await setWithExpiry(
    REDIS_KEYS.REFRESH_TOKEN(result.user.id),
    refreshToken,
    REFRESH_TOKEN_EXPIRY_SECONDS
  );

  // Clean up temp data
  await deleteKey(REDIS_KEYS.TEMP_REGISTRATION(tempToken));

  return {
    accessToken,
    refreshToken,
    user: {
      id: result.user.id,
      name: result.customer.name,
      phone: result.user.phone,
      email: result.user.email,
      role: result.user.role,
    },
  };
}

// ─── Login ───────────────────────────────────────────────────────────────────

export async function login(input: LoginInput) {
  const { identifier, password } = input;

  // Find user by phone or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { phone: identifier },
        { email: identifier },
      ],
    },
    include: {
      customer: true,
      technician: true,
      admin: true,
    },
  });

  if (!user) {
    throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw createError('Account is deactivated. Contact support.', 403, 'ACCOUNT_DEACTIVATED');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw createError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
  }

  // Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  // Store refresh token in Redis
  await setWithExpiry(
    REDIS_KEYS.REFRESH_TOKEN(user.id),
    refreshToken,
    REFRESH_TOKEN_EXPIRY_SECONDS
  );

  // Build user response based on role
  let name = '';
  if (user.customer) name = user.customer.name;
  else if (user.technician) name = user.technician.name;
  else if (user.admin) name = user.admin.name;

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name,
      phone: user.phone,
      email: user.email,
      role: user.role,
    },
  };
}

// ─── Refresh Token ───────────────────────────────────────────────────────────

export async function refreshAccessToken(refreshToken: string) {
  // Verify the refresh token
  let decoded: { userId: string; role: UserRole };
  try {
    decoded = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as typeof decoded;
  } catch {
    throw createError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
  }

  // Check if refresh token exists in Redis
  const storedToken = await getKey(REDIS_KEYS.REFRESH_TOKEN(decoded.userId));
  if (!storedToken || storedToken !== refreshToken) {
    throw createError('Refresh token expired or revoked', 401, 'REFRESH_TOKEN_REVOKED');
  }

  // Generate new access token
  const accessToken = generateAccessToken(decoded.userId, decoded.role);

  return { accessToken };
}

// ─── Logout ──────────────────────────────────────────────────────────────────

export async function logout(userId: string) {
  await deleteKey(REDIS_KEYS.REFRESH_TOKEN(userId));
  return { message: 'Logged out successfully' };
}

// ─── Forgot Password ─────────────────────────────────────────────────────────

export async function forgotPassword(phone: string) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    // Don't reveal if user exists
    return { message: 'If this phone is registered, you will receive an OTP' };
  }

  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await setWithExpiry(
    REDIS_KEYS.OTP_LOGIN(phone),
    hashedOtp,
    OTP_EXPIRY_MINUTES * 60
  );

  // TODO: Send OTP via MSG91 / WhatsApp
  logger.info(`[AUTH] Password reset OTP for ${phone}: ${otp} (dev only)`);

  return { message: 'If this phone is registered, you will receive an OTP' };
}

// ─── Reset Password ──────────────────────────────────────────────────────────

export async function resetPassword(input: ResetPasswordInput) {
  const { phone, otp, newPassword } = input;

  const hashedOtp = await getKey(REDIS_KEYS.OTP_LOGIN(phone));
  if (!hashedOtp) {
    throw createError('OTP expired. Please request a new one.', 400, 'OTP_EXPIRED');
  }

  const isValid = await bcrypt.compare(otp, hashedOtp);
  if (!isValid) {
    throw createError('Invalid OTP', 400, 'INVALID_OTP');
  }

  // Update password
  const newHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  await prisma.user.update({
    where: { phone },
    data: { passwordHash: newHash },
  });

  // Clean up OTP
  await deleteKey(REDIS_KEYS.OTP_LOGIN(phone));

  // Invalidate all sessions
  const user = await prisma.user.findUnique({ where: { phone } });
  if (user) {
    await deleteKey(REDIS_KEYS.REFRESH_TOKEN(user.id));
  }

  return { message: 'Password reset successfully. Please login with your new password.' };
}

// ─── Send Booking OTP (for job closure) ──────────────────────────────────────

export async function sendBookingOtp(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: { include: { user: true } } },
  });

  if (!booking) {
    throw createError('Booking not found', 404, 'BOOKING_NOT_FOUND');
  }

  const otp = generateOTP();
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Store in Redis with 10 min TTL
  await setWithExpiry(
    REDIS_KEYS.OTP_BOOKING(bookingId),
    hashedOtp,
    OTP_EXPIRY_MINUTES * 60
  );

  // TODO: Send via WhatsApp (primary) + SMS (fallback)
  logger.info(`[AUTH] Booking closure OTP for ${booking.bookingRef}: ${otp} (dev only)`);

  return { message: 'OTP sent to customer for job closure verification' };
}
