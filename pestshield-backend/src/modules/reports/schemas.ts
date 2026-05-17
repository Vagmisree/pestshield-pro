import { z } from 'zod';
import { PestType, InfestationSeverity } from '@prisma/client';

export const createReportSchema = z.object({
  bookingId: z.string().uuid(),
  pestType: z.nativeEnum(PestType),
  severity: z.nativeEnum(InfestationSeverity),
  affectedAreas: z.array(z.string()).min(1),
  recommendedTreatment: z.string().min(10),
  chemicalsToBeUsed: z.array(z.string()).min(1),
  estimatedDuration: z.string().optional(),
  technicianNotes: z.string().max(1000).optional(),
});

export const updateReportSchema = createReportSchema.partial().omit({ bookingId: true });

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
