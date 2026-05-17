import { prisma } from '../../config/db.js';
import { createError } from '../../middleware/errorHandler.js';
import { uploadToS3, buildS3Key, getSignedS3Url } from '../../integrations/s3.js';
import { notifyReportReady } from '../notifications/service.js';
import { BookingStatus, ReportStatus } from '@prisma/client';
import type { CreateReportInput, UpdateReportInput } from './schemas.js';
import { logger } from '../../utils/logger.js';

// ─── Create Report ────────────────────────────────────────────────────────────

export async function createReport(technicianId: string, input: CreateReportInput) {
  const booking = await prisma.booking.findUnique({
    where: { id: input.bookingId },
    include: { customer: { include: { user: true } } },
  });
  if (!booking) throw createError('Booking not found', 404, 'NOT_FOUND');
  if (booking.technicianId !== technicianId) throw createError('Access denied', 403, 'FORBIDDEN');

  const allowedStatuses: BookingStatus[] = [BookingStatus.TECHNICIAN_ASSIGNED, BookingStatus.IN_PROGRESS];
  if (!allowedStatuses.includes(booking.status)) {
    throw createError('Cannot create report at this booking stage', 400, 'INVALID_STATUS');
  }

  const existing = await prisma.inspectionReport.findUnique({ where: { bookingId: input.bookingId } });
  if (existing) throw createError('Report already exists for this booking', 409, 'REPORT_EXISTS');

  const report = await prisma.$transaction(async (tx) => {
    const r = await tx.inspectionReport.create({
      data: {
        bookingId: input.bookingId,
        pestType: input.pestType,
        severity: input.severity,
        affectedAreas: input.affectedAreas,
        recommendedTreatment: input.recommendedTreatment,
        chemicalsToBeUsed: input.chemicalsToBeUsed,
        estimatedDuration: input.estimatedDuration,
        technicianNotes: input.technicianNotes,
        status: ReportStatus.PENDING_APPROVAL,
      },
    });
    await tx.booking.update({
      where: { id: input.bookingId },
      data: { status: BookingStatus.INSPECTION_DONE },
    });
    return r;
  });

  // Notify customer
  try {
    await notifyReportReady({
      phone: booking.customer.user.phone,
      customerName: booking.customer.name,
      bookingRef: booking.bookingRef,
      reportLink: `https://pestshieldpro.in/dashboard/reports`,
      recipientId: booking.customerId,
      bookingId: booking.id,
    });
  } catch (err) {
    logger.warn('[Report] Notification failed:', err);
  }

  return report;
}

// ─── Upload Photos ────────────────────────────────────────────────────────────

export async function uploadPhotos(
  reportId: string,
  technicianId: string,
  files: Express.Multer.File[],
  type: 'before' | 'after'
) {
  const report = await prisma.inspectionReport.findUnique({
    where: { id: reportId },
    include: { booking: true },
  });
  if (!report) throw createError('Report not found', 404, 'NOT_FOUND');
  if (report.booking.technicianId !== technicianId) throw createError('Access denied', 403, 'FORBIDDEN');
  if (report.status !== ReportStatus.PENDING_APPROVAL) {
    throw createError('Cannot upload photos after report is approved', 400, 'INVALID_STATUS');
  }

  const currentPhotos = type === 'before' ? report.beforePhotos : report.afterPhotos;
  if (currentPhotos.length + files.length > 10) {
    throw createError('Maximum 10 photos per report', 400, 'TOO_MANY_PHOTOS');
  }

  const uploadedUrls: string[] = [];
  for (const file of files) {
    const key = buildS3Key(
      `reports/${report.bookingId}/${type}`,
      `${Date.now()}-${file.originalname}`
    );
    const url = await uploadToS3(file.buffer, key, file.mimetype);
    if (url) uploadedUrls.push(url);
  }

  const updatedReport = await prisma.inspectionReport.update({
    where: { id: reportId },
    data: type === 'before'
      ? { beforePhotos: [...currentPhotos, ...uploadedUrls] }
      : { afterPhotos: [...currentPhotos, ...uploadedUrls] },
  });

  return updatedReport;
}

// ─── Get Report ───────────────────────────────────────────────────────────────

export async function getReport(bookingId: string, requesterId: string, requesterRole: string) {
  const report = await prisma.inspectionReport.findUnique({
    where: { bookingId },
    include: { booking: { include: { customer: true, technician: true } } },
  });
  if (!report) throw createError('Report not found', 404, 'NOT_FOUND');

  // Access control
  if (requesterRole === 'CUSTOMER' && report.booking.customerId !== requesterId) {
    throw createError('Access denied', 403, 'FORBIDDEN');
  }
  if (requesterRole === 'TECHNICIAN' && report.booking.technicianId !== requesterId) {
    throw createError('Access denied', 403, 'FORBIDDEN');
  }

  // Generate signed URLs for photos (1-hour expiry)
  const signedBefore = await Promise.all(
    report.beforePhotos.map(async (url) => {
      const key = url.split('.amazonaws.com/')[1];
      return key ? getSignedS3Url(key, 3600) : url;
    })
  );
  const signedAfter = await Promise.all(
    report.afterPhotos.map(async (url) => {
      const key = url.split('.amazonaws.com/')[1];
      return key ? getSignedS3Url(key, 3600) : url;
    })
  );

  return { ...report, beforePhotos: signedBefore, afterPhotos: signedAfter };
}

// ─── Update Report ────────────────────────────────────────────────────────────

export async function updateReport(reportId: string, technicianId: string, input: UpdateReportInput) {
  const report = await prisma.inspectionReport.findUnique({
    where: { id: reportId },
    include: { booking: true },
  });
  if (!report) throw createError('Report not found', 404, 'NOT_FOUND');
  if (report.booking.technicianId !== technicianId) throw createError('Access denied', 403, 'FORBIDDEN');
  if (report.status !== ReportStatus.PENDING_APPROVAL) {
    throw createError('Cannot edit an approved report', 400, 'REPORT_LOCKED');
  }

  return prisma.inspectionReport.update({ where: { id: reportId }, data: input });
}

// ─── Approve Report (Customer action) ────────────────────────────────────────

export async function approveReportById(reportId: string, customerId: string) {
  const report = await prisma.inspectionReport.findUnique({
    where: { id: reportId },
    include: { booking: { include: { technician: { include: { user: true } } } } },
  });
  if (!report) throw createError('Report not found', 404, 'NOT_FOUND');
  if (report.booking.customerId !== customerId) throw createError('Access denied', 403, 'FORBIDDEN');
  if (report.status !== ReportStatus.PENDING_APPROVAL) {
    throw createError('Report already processed', 400, 'ALREADY_PROCESSED');
  }

  await prisma.$transaction([
    prisma.inspectionReport.update({
      where: { id: reportId },
      data: { status: ReportStatus.APPROVED, approvedAt: new Date() },
    }),
    prisma.booking.update({
      where: { id: report.bookingId },
      data: { status: BookingStatus.APPROVED },
    }),
  ]);

  // Notify technician to proceed
  if (report.booking.technician) {
    const { sendWhatsApp } = await import('../../integrations/interakt.js');
    await sendWhatsApp({
      phone: report.booking.technician.user.phone,
      templateName: 'report_approved',
      variables: [report.booking.technician.name, report.booking.bookingRef],
      bookingId: report.bookingId,
      recipientId: report.booking.technicianId!,
    });
  }

  return { message: 'Report approved. Technician notified to proceed with treatment.' };
}
