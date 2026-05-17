import { z } from 'zod';
import { PropertyType, PlanType, TimeSlot } from '@prisma/client';

export const createBookingSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID'),
  propertyType: z.nativeEnum(PropertyType),
  propertySize: z.string().optional(),
  address: z.string().min(10, 'Address too short'),
  pincode: z.string().length(6, 'Pincode must be 6 digits').regex(/^\d+$/),
  city: z.string().min(2),
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  slotTime: z.nativeEnum(TimeSlot),
  planType: z.nativeEnum(PlanType).default(PlanType.SINGLE),
  notes: z.string().max(500).optional(),
  couponCode: z.string().optional(),
});

export const rescheduleSchema = z.object({
  slotDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slotTime: z.nativeEnum(TimeSlot),
});

export const cancelSchema = z.object({
  reason: z.string().min(5, 'Please provide a reason').max(300),
});

export const closeBookingSchema = z.object({
  otp: z.string().length(6).regex(/^\d+$/),
});

export const bookingListQuerySchema = z.object({
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  serviceType: z.string().optional(),
  technicianId: z.string().uuid().optional(),
  pincode: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.string().default('20'),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type RescheduleInput = z.infer<typeof rescheduleSchema>;
export type CancelInput = z.infer<typeof cancelSchema>;
export type CloseBookingInput = z.infer<typeof closeBookingSchema>;
export type BookingListQuery = z.infer<typeof bookingListQuerySchema>;
