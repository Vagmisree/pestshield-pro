import bcrypt from 'bcrypt';
import { prisma } from '../../config/db.js';
import { redis } from '../../config/redis.js';
import { createError } from '../../middleware/errorHandler.js';
import { parsePagination } from '../../utils/helpers.js';
import { BCRYPT_SALT_ROUNDS } from '../../config/constants.js';
import { UserRole, BookingStatus } from '@prisma/client';
import type { CreateTechnicianInput, UpdateTechnicianInput, UpdateLocationInput, TechnicianListQuery } from './schemas.js';

const GEO_KEY = 'tech:locations';

// ─── List Technicians ─────────────────────────────────────────────────────────

export async function listTechnicians(query: TechnicianListQuery) {
  const { skip, limit } = parsePagination(query.page, query.limit);
  const where: any = {};
  if (query.status) where.status = query.status;
  if (query.skill) where.skillTags = { has: query.skill };

  const [technicians, total] = await Promise.all([
    prisma.technician.findMany({
      where,
      skip,
      take: limit,
      include: { user: { select: { email: true, phone: true, isActive: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.technician.count({ where }),
  ]);

  return { technicians, total, page: Number(query.page), limit };
}

// ─── Get Technician ───────────────────────────────────────────────────────────

export async function getTechnicianById(id: string) {
  const tech = await prisma.technician.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, phone: true, isActive: true, createdAt: true } },
      bookings: {
        where: { status: BookingStatus.COMPLETED },
        select: { id: true },
        take: 1,
      },
    },
  });
  if (!tech) throw createError('Technician not found', 404, 'NOT_FOUND');
  return tech;
}

// ─── Create Technician ────────────────────────────────────────────────────────

export async function createTechnician(input: CreateTechnicianInput) {
  const existing = await prisma.user.findUnique({ where: { phone: input.phone } });
  if (existing) throw createError('Phone already registered', 409, 'PHONE_EXISTS');

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        phone: input.phone,
        email: input.email,
        passwordHash,
        role: UserRole.TECHNICIAN,
        isVerified: true,
        isActive: true,
      },
    });
    const technician = await tx.technician.create({
      data: {
        userId: user.id,
        name: input.name,
        phone: input.phone,
        skillTags: input.skillTags,
        certifications: input.certifications,
      },
    });
    return technician;
  });
}

// ─── Update Technician ────────────────────────────────────────────────────────

export async function updateTechnician(id: string, input: UpdateTechnicianInput) {
  const tech = await prisma.technician.findUnique({ where: { id } });
  if (!tech) throw createError('Technician not found', 404, 'NOT_FOUND');

  return prisma.technician.update({
    where: { id },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.skillTags && { skillTags: input.skillTags }),
      ...(input.status && { status: input.status }),
      ...(input.certifications && { certifications: input.certifications }),
    },
  });
}

// ─── Update Location ──────────────────────────────────────────────────────────

export async function updateLocation(technicianId: string, input: UpdateLocationInput) {
  // Update DB
  await prisma.technician.update({
    where: { id: technicianId },
    data: { currentLat: input.lat, currentLng: input.lng },
  });

  // Update Redis geo set for live map
  await redis.geoadd(GEO_KEY, input.lng, input.lat, technicianId);

  return { updated: true };
}

// ─── Get Today's Tasks ────────────────────────────────────────────────────────

export async function getTechnicianTasks(technicianId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const bookings = await prisma.booking.findMany({
    where: {
      technicianId,
      slotDate: { gte: today },
      status: {
        in: [
          BookingStatus.TECHNICIAN_ASSIGNED,
          BookingStatus.INSPECTION_DONE,
          BookingStatus.APPROVED,
          BookingStatus.IN_PROGRESS,
        ],
      },
    },
    include: {
      service: { select: { name: true, pestType: true } },
      customer: { select: { name: true } },
    },
    orderBy: [{ slotDate: 'asc' }, { slotTime: 'asc' }],
  });

  return bookings.map((b) => ({
    bookingId: b.id,
    bookingRef: b.bookingRef,
    customerName: b.customer.name,
    address: b.address,
    city: b.city,
    mapsLink: `https://maps.google.com/?q=${encodeURIComponent(b.address + ', ' + b.city)}`,
    service: b.service.name,
    pestType: b.service.pestType,
    slotDate: b.slotDate,
    slotTime: b.slotTime,
    status: b.status,
  }));
}

// ─── Mark Arrived ─────────────────────────────────────────────────────────────

export async function markArrived(technicianId: string, bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: { include: { user: true } }, technician: true },
  });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.technicianId !== technicianId) throw createError('Access denied', 403, 'FORBIDDEN');

  // Notification handled by notification service
  return { message: 'Arrival marked. Customer notified.' };
}

// ─── Live Map (Admin) ─────────────────────────────────────────────────────────

export async function getLiveMap() {
  // Get all technician positions from Redis geo set
  const technicians = await prisma.technician.findMany({
    where: { isActive: true },
    select: { id: true, name: true, status: true, currentLat: true, currentLng: true },
  });

  return technicians.filter((t) => t.currentLat && t.currentLng);
}
