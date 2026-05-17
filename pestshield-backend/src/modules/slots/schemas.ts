import { z } from 'zod';
import { TimeSlot } from '@prisma/client';

export const availableSlotsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  pincode: z.string().length(6, 'Pincode must be 6 digits'),
  pestType: z.string().optional(),
  technicianId: z.string().uuid().optional(),
});

export type AvailableSlotsQuery = z.infer<typeof availableSlotsSchema>;
