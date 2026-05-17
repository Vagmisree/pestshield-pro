import { prisma } from '../../config/db.js';
import { redis } from '../../config/redis.js';
import { createError } from '../../middleware/errorHandler.js';
import { parsePagination } from '../../utils/helpers.js';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import type {
  ReassignInput, UpdateComplaintInput, CreateCouponInput,
  UpdateCouponInput, BroadcastInput, RevenueQuery, AdminBookingsQuery,
} from './schemas.js';

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboard() {
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
  const monthStart = new Date(now); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [
    todayBookings, weekRevenue, monthRevenue, todayRevenue,
    pendingApprovals, upcomingSlots, openComplaints, technicians,
  ] = await Promise.all([
    // Today's booking counts
    prisma.booking.groupBy({
      by: ['status'],
      where: { createdAt: { gte: todayStart } },
      _count: true,
    }),
    // Week revenue
    prisma.payment.aggregate({
      where: { status: PaymentStatus.SUCCESS, createdAt: { gte: weekStart } },
      _sum: { total: true, gst: true },
    }),
    // Month revenue
    prisma.payment.aggregate({
      where: { status: PaymentStatus.SUCCESS, createdAt: { gte: monthStart } },
      _sum: { total: true, gst: true },
    }),
    // Today revenue
    prisma.payment.aggregate({
      where: { status: PaymentStatus.SUCCESS, createdAt: { gte: todayStart } },
      _sum: { total: true },
    }),
    // Reports pending approval > 24 hrs
    prisma.inspectionReport.findMany({
      where: {
        status: 'PENDING_APPROVAL',
        createdAt: { lte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      },
      include: { booking: { select: { bookingRef: true, customer: { select: { name: true } } } } },
      take: 10,
    }),
    // Upcoming slots next 24h
    prisma.booking.findMany({
      where: {
        slotDate: { gte: now, lte: next24h },
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.TECHNICIAN_ASSIGNED] },
      },
      include: {
        service: { select: { name: true } },
        technician: { select: { name: true } },
        customer: { select: { name: true } },
      },
      orderBy: { slotDate: 'asc' },
      take: 20,
    }),
    // Open complaints (from bookings with CANCELLED + reason)
    prisma.booking.findMany({
      where: { cancelReason: { not: null }, status: BookingStatus.CANCELLED },
      select: { id: true, bookingRef: true, cancelReason: true, cancelledAt: true, customer: { select: { name: true } } },
      take: 10,
      orderBy: { cancelledAt: 'desc' },
    }),
    // Technician locations
    prisma.technician.findMany({
      where: { isActive: true },
      select: { id: true, name: true, status: true, currentLat: true, currentLng: true },
    }),
  ]);

  const bookingCounts = { total: 0, confirmed: 0, inProgress: 0, completed: 0 };
  for (const g of todayBookings) {
    bookingCounts.total += g._count;
    if (g.status === BookingStatus.CONFIRMED) bookingCounts.confirmed = g._count;
    if (g.status === BookingStatus.IN_PROGRESS) bookingCounts.inProgress = g._count;
    if (g.status === BookingStatus.COMPLETED) bookingCounts.completed = g._count;
  }

  // Contracts expiring in 30 days
  const contractsExpiringSoon = await prisma.coupon.findMany({
    where: {
      validUntil: { lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), gte: now },
      isActive: true,
    },
    take: 10,
  });

  return {
    todayBookings: bookingCounts,
    revenue: {
      today: todayRevenue._sum.total || 0,
      week: weekRevenue._sum.total || 0,
      month: monthRevenue._sum.total || 0,
      gstCollected: monthRevenue._sum.gst || 0,
    },
    pendingApprovals,
    upcomingSlots,
    contractsExpiringSoon,
    openComplaints,
    technicianMap: technicians.filter(t => t.currentLat && t.currentLng),
  };
}

// ─── Admin Bookings ───────────────────────────────────────────────────────────

export async function getAdminBookings(query: AdminBookingsQuery) {
  const { skip, limit } = parsePagination(query.page, query.limit);
  const where: any = {};
  if (query.status) where.status = query.status;
  if (query.technicianId) where.technicianId = query.technicianId;
  if (query.pincode) where.pincode = query.pincode;
  if (query.paymentStatus) where.paymentStatus = query.paymentStatus;
  if (query.serviceId) where.serviceId = query.serviceId;
  if (query.dateFrom || query.dateTo) {
    where.slotDate = {};
    if (query.dateFrom) where.slotDate.gte = new Date(query.dateFrom);
    if (query.dateTo) where.slotDate.lte = new Date(query.dateTo);
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where, skip, take: limit,
      include: {
        service: { select: { name: true } },
        technician: { select: { name: true, phone: true } },
        customer: { select: { name: true, user: { select: { phone: true } } } },
        payments: { select: { status: true, total: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.booking.count({ where }),
  ]);

  if (query.format === 'csv') {
    const rows = bookings.map(b => [
      b.bookingRef, b.customer.name, b.customer.user.phone,
      b.service.name, b.slotDate.toISOString().split('T')[0],
      b.slotTime, b.status, b.totalAmount, b.paymentStatus,
      b.technician?.name || 'Unassigned',
    ]);
    const header = 'BookingRef,Customer,Phone,Service,Date,Slot,Status,Amount,Payment,Technician\n';
    return { csv: header + rows.map(r => r.join(',')).join('\n') };
  }

  return { bookings, total, page: Number(query.page), limit };
}

// ─── Reassign Technician ──────────────────────────────────────────────────────

export async function reassignTechnician(bookingId: string, input: ReassignInput, adminId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');

  const tech = await prisma.technician.findUnique({ where: { id: input.technicianId } });
  if (!tech || !tech.isActive) throw createError('Technician not found or inactive', 404, 'NOT_FOUND');

  // Free old slot
  if (booking.technicianId) {
    await prisma.slot.updateMany({
      where: { technicianId: booking.technicianId, bookingId },
      data: { isAvailable: true, bookingId: null },
    });
  }

  const slotDate = new Date(booking.slotDate); slotDate.setHours(0, 0, 0, 0);

  await prisma.$transaction(async (tx) => {
    await tx.slot.upsert({
      where: { technicianId_date_timeSlot: { technicianId: input.technicianId, date: slotDate, timeSlot: booking.slotTime } },
      create: { technicianId: input.technicianId, date: slotDate, timeSlot: booking.slotTime, isAvailable: false, bookingId },
      update: { isAvailable: false, bookingId },
    });
    await tx.booking.update({
      where: { id: bookingId },
      data: { technicianId: input.technicianId, status: BookingStatus.TECHNICIAN_ASSIGNED, assignedAt: new Date() },
    });
    await tx.auditLog.create({
      data: { actorId: adminId, actorRole: 'ADMIN', action: 'REASSIGN_TECHNICIAN', entityType: 'Booking', entityId: bookingId, newValue: { technicianId: input.technicianId } },
    });
  });

  return { message: 'Technician reassigned successfully' };
}

// ─── Technician Performance ───────────────────────────────────────────────────

export async function getTechnicianPerformance() {
  const technicians = await prisma.technician.findMany({
    include: {
      user: { select: { phone: true, email: true } },
      bookings: { where: { status: BookingStatus.COMPLETED }, select: { id: true } },
    },
  });

  return technicians.map(t => ({
    id: t.id, name: t.name, phone: t.phone, status: t.status,
    avgRating: t.avgRating, totalJobsCompleted: t.totalJobsCompleted,
    isActive: t.isActive, skillTags: t.skillTags,
    utilizationRate: t.totalJobsCompleted > 0
      ? Math.min(100, Math.round((t.totalJobsCompleted / 30) * 100))
      : 0,
  }));
}

// ─── Block Technician ─────────────────────────────────────────────────────────

export async function blockTechnician(technicianId: string, adminId: string) {
  const tech = await prisma.technician.findUnique({ where: { id: technicianId } });
  if (!tech) throw createError('Technician not found', 404, 'NOT_FOUND');

  await prisma.$transaction([
    prisma.technician.update({ where: { id: technicianId }, data: { isActive: false } }),
    prisma.user.update({ where: { id: tech.userId }, data: { isActive: false } }),
    prisma.auditLog.create({
      data: { actorId: adminId, actorRole: 'ADMIN', action: 'BLOCK_TECHNICIAN', entityType: 'Technician', entityId: technicianId },
    }),
  ]);

  return { message: 'Technician account deactivated' };
}

// ─── Revenue Report ───────────────────────────────────────────────────────────

export async function getRevenue(query: RevenueQuery) {
  const where: any = { status: PaymentStatus.SUCCESS };
  if (query.dateFrom) where.createdAt = { ...where.createdAt, gte: new Date(query.dateFrom) };
  if (query.dateTo) where.createdAt = { ...where.createdAt, lte: new Date(query.dateTo) };

  const payments = await prisma.payment.findMany({
    where,
    include: { booking: { include: { service: { select: { name: true } }, customer: { select: { name: true } } } } },
    orderBy: { createdAt: 'desc' },
  });

  const summary = {
    totalRevenue: payments.reduce((s, p) => s + p.total, 0),
    totalGST: payments.reduce((s, p) => s + p.gst, 0),
    totalBase: payments.reduce((s, p) => s + p.amount, 0),
    count: payments.length,
  };

  if (query.format === 'csv') {
    const rows = payments.map(p => [
      p.createdAt.toISOString().split('T')[0],
      p.booking.bookingRef, p.booking.customer.name,
      p.booking.service.name, p.amount, p.gst, p.total, p.method,
    ]);
    const header = 'Date,BookingRef,Customer,Service,Base,GST,Total,Method\n';
    return { csv: header + rows.map(r => r.join(',')).join('\n'), summary };
  }

  return { payments, summary };
}

// ─── Complaints ───────────────────────────────────────────────────────────────

export async function getComplaints() {
  const SLA_HOURS = 48;
  const bookings = await prisma.booking.findMany({
    where: { cancelReason: { not: null } },
    include: { customer: { select: { name: true, user: { select: { phone: true } } } }, service: { select: { name: true } } },
    orderBy: { cancelledAt: 'desc' },
  });

  return bookings.map(b => {
    const hoursElapsed = b.cancelledAt
      ? (Date.now() - b.cancelledAt.getTime()) / (1000 * 60 * 60)
      : 0;
    return {
      ...b,
      slaHoursRemaining: Math.max(0, SLA_HOURS - hoursElapsed),
      slaBreached: hoursElapsed > SLA_HOURS,
    };
  });
}

// ─── Customers ────────────────────────────────────────────────────────────────

export async function getCustomers(page = 1, limit = 20) {
  const { skip } = parsePagination(page, limit);
  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      skip, take: limit,
      include: {
        user: { select: { phone: true, email: true, isActive: true, createdAt: true } },
        bookings: { select: { id: true, status: true, totalAmount: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.customer.count(),
  ]);

  return customers.map(c => ({
    ...c,
    totalBookings: c.bookings.length,
    completedBookings: c.bookings.filter(b => b.status === BookingStatus.COMPLETED).length,
    ltv: c.bookings.reduce((s, b) => s + b.totalAmount, 0),
  }));
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function createCoupon(input: CreateCouponInput) {
  const existing = await prisma.coupon.findUnique({ where: { code: input.code } });
  if (existing) throw createError('Coupon code already exists', 409, 'COUPON_EXISTS');

  return prisma.coupon.create({
    data: {
      code: input.code,
      discountType: input.discountType,
      discountValue: input.discountValue,
      maxUses: input.maxUses,
      validFrom: new Date(input.validFrom),
      validUntil: new Date(input.validUntil),
    },
  });
}

export async function listCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function updateCoupon(id: string, input: UpdateCouponInput) {
  return prisma.coupon.update({ where: { id }, data: input });
}

// ─── Notification Log ─────────────────────────────────────────────────────────

export async function getNotificationLog(page = 1, limit = 50) {
  const { skip } = parsePagination(page, limit);
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      skip, take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count(),
  ]);
  return { notifications, total };
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export async function getAuditLog(page = 1, limit = 50) {
  const { skip } = parsePagination(page, limit);
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.auditLog.count(),
  ]);
  return { logs, total };
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics() {
  const now = new Date();
  const twelveMonthsAgo = new Date(now);
  twelveMonthsAgo.setMonth(now.getMonth() - 12);

  const [bookingsByService, revenueByMonth, bookingsByPincode, techLeaderboard] = await Promise.all([
    // Bookings by service type
    prisma.booking.groupBy({
      by: ['serviceId'],
      _count: true,
      where: { status: BookingStatus.COMPLETED },
    }),
    // Revenue last 12 months
    prisma.payment.findMany({
      where: { status: PaymentStatus.SUCCESS, createdAt: { gte: twelveMonthsAgo } },
      select: { total: true, createdAt: true },
    }),
    // Bookings by pincode
    prisma.booking.groupBy({ by: ['pincode'], _count: true, orderBy: { _count: { pincode: 'desc' } }, take: 20 }),
    // Technician leaderboard
    prisma.technician.findMany({
      where: { isActive: true },
      select: { id: true, name: true, totalJobsCompleted: true, avgRating: true },
      orderBy: { totalJobsCompleted: 'desc' },
      take: 10,
    }),
  ]);

  // Group revenue by month
  const revenueMap: Record<string, number> = {};
  for (const p of revenueByMonth) {
    const key = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`;
    revenueMap[key] = (revenueMap[key] || 0) + p.total;
  }

  return {
    bookingsByService,
    revenueTrend: Object.entries(revenueMap).map(([month, revenue]) => ({ month, revenue })),
    bookingsByPincode,
    techLeaderboard,
  };
}
