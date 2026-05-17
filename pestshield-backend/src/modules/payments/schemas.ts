import { z } from 'zod';

export const createOrderSchema = z.object({
  bookingId: z.string().uuid(),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
  bookingId: z.string().uuid(),
});

export const refundSchema = z.object({
  bookingId: z.string().uuid(),
  reason: z.string().min(5).max(300),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
export type RefundInput = z.infer<typeof refundSchema>;
