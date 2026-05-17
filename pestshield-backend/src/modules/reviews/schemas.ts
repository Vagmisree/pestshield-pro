import { z } from 'zod';

export const createReviewSchema = z.object({
  bookingId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const moderateReviewSchema = z.object({
  status: z.enum(['PUBLISHED', 'REJECTED']),
});

export const reviewQuerySchema = z.object({
  serviceType: z.string().optional(),
  rating: z.string().optional(),
  page: z.string().default('1'),
  limit: z.string().default('20'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type ModerateReviewInput = z.infer<typeof moderateReviewSchema>;
export type ReviewQuery = z.infer<typeof reviewQuerySchema>;
