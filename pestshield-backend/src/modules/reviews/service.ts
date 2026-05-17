import { prisma } from '../../config/db.js';
import { redis } from '../../config/redis.js';
import { createError } from '../../middleware/errorHandler.js';
import { parsePagination } from '../../utils/helpers.js';
import { BookingStatus, ReviewStatus } from '@prisma/client';
import type { CreateReviewInput, ModerateReviewInput, ReviewQuery } from './schemas.js';

const AGGREGATE_CACHE_KEY = 'reviews:aggregate';
const CACHE_TTL = 3600; // 1 hour

export async function submitReview(customerId: string, input: CreateReviewInput) {
  const booking = await prisma.booking.findUnique({ where: { id: input.bookingId } });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.customerId !== customerId) throw createError('Access denied', 403, 'FORBIDDEN');
  if (booking.status !== BookingStatus.COMPLETED) throw createError('Can only review completed bookings', 400, 'BOOKING_NOT_COMPLETED');

  const existing = await prisma.review.findUnique({ where: { bookingId: input.bookingId } });
  if (existing) throw createError('Review already submitted', 409, 'REVIEW_EXISTS');

  const review = await prisma.review.create({
    data: { bookingId: input.bookingId, customerId, rating: input.rating, comment: input.comment, status: ReviewStatus.PENDING },
  });

  // Invalidate cache
  await redis.del(AGGREGATE_CACHE_KEY);
  return review;
}

export async function getPublishedReviews(query: ReviewQuery) {
  const { skip, limit } = parsePagination(query.page, query.limit);
  const where: any = { status: ReviewStatus.PUBLISHED };
  if (query.rating) where.rating = parseInt(query.rating);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where, skip, take: limit,
      include: {
        customer: { select: { name: true } },
        booking: { include: { service: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where }),
  ]);
  return { reviews, total };
}

export async function moderateReview(reviewId: string, input: ModerateReviewInput) {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { status: input.status as ReviewStatus },
    include: { booking: { include: { technician: true } } },
  });

  // Update technician avg rating if published
  if (input.status === 'PUBLISHED' && review.booking.technicianId) {
    const stats = await prisma.review.aggregate({
      where: {
        status: ReviewStatus.PUBLISHED,
        booking: { technicianId: review.booking.technicianId },
      },
      _avg: { rating: true },
    });
    await prisma.technician.update({
      where: { id: review.booking.technicianId },
      data: { avgRating: stats._avg.rating || 0 },
    });
  }

  await redis.del(AGGREGATE_CACHE_KEY);
  return review;
}

export async function getAggregate() {
  // Try cache first
  const cached = await redis.get(AGGREGATE_CACHE_KEY);
  if (cached) return JSON.parse(cached);

  const [total, avgResult, breakdown] = await Promise.all([
    prisma.review.count({ where: { status: ReviewStatus.PUBLISHED } }),
    prisma.review.aggregate({ where: { status: ReviewStatus.PUBLISHED }, _avg: { rating: true } }),
    prisma.review.groupBy({ by: ['rating'], where: { status: ReviewStatus.PUBLISHED }, _count: true }),
  ]);

  const result = {
    avgRating: Math.round((avgResult._avg.rating || 0) * 10) / 10,
    totalCount: total,
    breakdownByStars: breakdown.reduce((acc, b) => ({ ...acc, [b.rating]: b._count }), {} as Record<number, number>),
  };

  await redis.set(AGGREGATE_CACHE_KEY, JSON.stringify(result), 'EX', CACHE_TTL);
  return result;
}
