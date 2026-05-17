import { z } from 'zod';
import { PestType, TechnicianStatus } from '@prisma/client';

export const createTechnicianSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email().optional(),
  password: z.string().min(8),
  skillTags: z.array(z.nativeEnum(PestType)).min(1),
  certifications: z.array(z.string()).default([]),
});

export const updateTechnicianSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  skillTags: z.array(z.nativeEnum(PestType)).optional(),
  status: z.nativeEnum(TechnicianStatus).optional(),
  certifications: z.array(z.string()).optional(),
});

export const updateLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const technicianListQuerySchema = z.object({
  status: z.nativeEnum(TechnicianStatus).optional(),
  city: z.string().optional(),
  skill: z.nativeEnum(PestType).optional(),
  page: z.string().default('1'),
  limit: z.string().default('20'),
});

export type CreateTechnicianInput = z.infer<typeof createTechnicianSchema>;
export type UpdateTechnicianInput = z.infer<typeof updateTechnicianSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
export type TechnicianListQuery = z.infer<typeof technicianListQuerySchema>;
