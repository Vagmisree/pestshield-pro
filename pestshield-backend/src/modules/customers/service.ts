import { prisma } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { BookingStatus } from '@prisma/client';
import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  addresses: z.array(z.object({
    label: z.string(),
    line1: z.string(),
    city: z.string(),
    pincode: z.string().length(6),
    state: z.string(),
  })).optional(),
});

export const complaintSchema = z.object({
  bookingId: z.string().uuid(),
  type: z.enum(['RE_SERVICE', 'COMPLAINT']),
  description: z.string().min(10).max(1000),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ComplaintInput = z.infer<typeof complaintSchema>;

export async function getProfile(customerId: string) {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { user: { select: { phone: true, email: true, createdAt: true } } },
  });
  if (!customer) throw createError('Customer not found', 404, 'NOT_FOUND');
  return customer;
}

export async function updateProfile(customerId: string, input: UpdateProfileInput) {
  const updateData: any = {};
  if (input.name) updateData.name = input.name;
  if (input.addresses) updateData.addresses = input.addresses;

  const customer = await prisma.customer.update({ where: { id: customerId }, data: updateData });

  if (input.email) {
    const c = await prisma.customer.findUnique({ where: { id: customerId } });
    if (c) await prisma.user.update({ where: { id: c.userId }, data: { email: input.email } });
  }

  return customer;
}

export async function submitComplaint(customerId: string, input: ComplaintInput) {
  const booking = await prisma.booking.findUnique({ where: { id: input.bookingId } });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.customerId !== customerId) throw createError('Access denied', 403, 'FORBIDDEN');

  if (input.type === 'RE_SERVICE') {
    if (booking.status !== BookingStatus.COMPLETED) throw createError('Re-service only for completed bookings', 400, 'INVALID_STATUS');
    if (booking.completedAt) {
      const daysSince = (Date.now() - booking.completedAt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince > 7) throw createError('Re-service window (7 days) has expired', 400, 'RESERVICE_EXPIRED');
    }
  }

  // Store complaint as booking cancel reason (reusing existing field for simplicity)
  return prisma.booking.update({
    where: { id: input.bookingId },
    data: { cancelReason: `[${input.type}] ${input.description}` },
  });
}

export async function getMyComplaints(customerId: string) {
  return prisma.booking.findMany({
    where: { customerId, cancelReason: { not: null } },
    select: { id: true, bookingRef: true, cancelReason: true, cancelledAt: true, status: true, service: { select: { name: true } } },
    orderBy: { cancelledAt: 'desc' },
  });
}
