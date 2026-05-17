import { z } from 'zod';

export const reassignSchema = z.object({
  technicianId: z.string().uuid(),
});

export const updateComplaintSchema = z.object({
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']),
  technicianId: z.string().uuid().optional(),
  adminNote: z.string().max(500).optional(),
});

export const createCouponSchema = z.object({
  code: z.string().min(3).max(20).toUpperCase(),
  discountType: z.enum(['PERCENT', 'FLAT']),
  discountValue: z.number().positive(),
  maxUses: z.number().int().positive().default(100),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
});

export const updateCouponSchema = z.object({
  isActive: z.boolean().optional(),
  maxUses: z.number().int().positive().optional(),
  validUntil: z.string().datetime().optional(),
});

export const broadcastSchema = z.object({
  channel: z.enum(['WHATSAPP', 'SMS', 'EMAIL']),
  templateName: z.string(),
  message: z.string().max(1000),
  targetRole: z.enum(['CUSTOMER', 'TECHNICIAN', 'ALL']).default('ALL'),
});

export const revenueQuerySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  serviceType: z.string().optional(),
  pincode: z.string().optional(),
  format: z.enum(['json', 'csv']).default('json'),
});

export const adminBookingsQuerySchema = z.object({
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  serviceId: z.string().optional(),
  technicianId: z.string().optional(),
  pincode: z.string().optional(),
  paymentStatus: z.string().optional(),
  page: z.string().default('1'),
  limit: z.string().default('20'),
  format: z.enum(['json', 'csv']).default('json'),
});

export type ReassignInput = z.infer<typeof reassignSchema>;
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>;
export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type BroadcastInput = z.infer<typeof broadcastSchema>;
export type RevenueQuery = z.infer<typeof revenueQuerySchema>;
export type AdminBookingsQuery = z.infer<typeof adminBookingsQuerySchema>;
