import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { logger } from './utils/logger.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// ─── Route Imports ────────────────────────────────────────────────────────────
import authRoutes from './modules/auth/routes.js';
import bookingRoutes from './modules/bookings/routes.js';
import paymentRoutes from './modules/payments/routes.js';
import technicianRoutes from './modules/technicians/routes.js';
import reportRoutes from './modules/reports/routes.js';
import slotRoutes from './modules/slots/routes.js';
import adminRoutes from './modules/admin/routes.js';
import shopRoutes from './modules/shop/routes.js';
import blogRoutes from './modules/blog/routes.js';
import reviewRoutes from './modules/reviews/routes.js';
import customerRoutes from './modules/customers/routes.js';
import branchRoutes from './modules/branches/routes.js';

// ─── Create Express App ───────────────────────────────────────────────────────
const app: Express = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
// Razorpay webhook needs raw body — mount before json parser
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// ─── Logging ──────────────────────────────────────────────────────────────────
app.use(morgan('short', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use(generalLimiter);

// ─── Static File Serving (local uploads) ─────────────────────────────────────
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'PestShield Pro API is running',
    version: '1.0.0',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/branches', branchRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = parseInt(env.PORT, 10);

async function bootstrap() {
  await connectDatabase();

  // Start background workers (only in non-test env)
  if (env.NODE_ENV !== 'test') {
    const { assignmentWorker } = await import('./jobs/assignment.job.js');
    const { invoiceWorker } = await import('./jobs/invoice.job.js');
    const { followUpWorker } = await import('./jobs/followup.job.js');
    const { notificationWorker } = await import('./jobs/notification.job.js');
    logger.info('✅ Background workers started');
  }

  app.listen(PORT, () => {
    logger.info(`🚀 PestShield Pro API running on port ${PORT}`);
    logger.info(`📍 Environment: ${env.NODE_ENV}`);
    logger.info(`🔗 Health: http://localhost:${PORT}/api/health`);
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
