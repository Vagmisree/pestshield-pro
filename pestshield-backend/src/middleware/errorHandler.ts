import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Default values
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational ?? false;

  // Log error
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.path} - ${err.message}`, {
      stack: err.stack,
      body: req.body,
      params: req.params,
      query: req.query,
      ip: req.ip,
    });
  } else {
    logger.warn(`[${req.method}] ${req.path} - ${err.message}`, {
      statusCode,
      code: err.code,
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Prisma known errors
  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      success: false,
      message: 'Database operation failed',
      code: 'DB_ERROR',
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      code: 'AUTH_ERROR',
    });
    return;
  }

  // Operational errors (expected)
  if (isOperational) {
    res.status(statusCode).json({
      success: false,
      message: err.message,
      code: err.code || 'ERROR',
    });
    return;
  }

  // Unknown errors (don't leak details in production)
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    code: 'INTERNAL_ERROR',
  });
}

/**
 * Create an operational error
 */
export function createError(message: string, statusCode: number, code?: string): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.code = code;
  error.isOperational = true;
  return error;
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    code: 'NOT_FOUND',
  });
}
