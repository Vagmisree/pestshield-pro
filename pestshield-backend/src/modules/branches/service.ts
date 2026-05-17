import { prisma } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { z } from 'zod';

export const createBranchSchema = z.object({
  city: z.string(), state: z.string(), address: z.string(),
  phone: z.string(), email: z.string().email(),
  lat: z.number(), lng: z.number(),
  mapUrl: z.string().url().optional(),
  workingHours: z.string().default('9:00 AM - 6:00 PM'),
  serviceablePincodes: z.array(z.string().length(6)).default([]),
});

export const updatePincodesSchema = z.object({
  add: z.array(z.string().length(6)).default([]),
  remove: z.array(z.string().length(6)).default([]),
});

export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdatePincodesInput = z.infer<typeof updatePincodesSchema>;

export async function getBranches() {
  return prisma.branch.findMany({ where: { isActive: true }, orderBy: { city: 'asc' } });
}

export async function checkPincode(pincode: string) {
  const branch = await prisma.branch.findFirst({
    where: { serviceablePincodes: { has: pincode }, isActive: true },
  });
  if (!branch) return { available: false };
  return { available: true, branch, estimatedResponseTime: '2-4 hours' };
}

export async function createBranch(input: CreateBranchInput) {
  return prisma.branch.create({ data: input });
}

export async function updatePincodes(branchId: string, input: UpdatePincodesInput) {
  const branch = await prisma.branch.findUnique({ where: { id: branchId } });
  if (!branch) throw createError('Branch not found', 404, 'NOT_FOUND');

  const current = new Set(branch.serviceablePincodes);
  input.add.forEach(p => current.add(p));
  input.remove.forEach(p => current.delete(p));

  return prisma.branch.update({ where: { id: branchId }, data: { serviceablePincodes: Array.from(current) } });
}
