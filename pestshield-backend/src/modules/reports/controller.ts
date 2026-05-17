import { Request, Response, NextFunction } from 'express';
import * as reportService from './service.js';
import type { CreateReportInput, UpdateReportInput } from './schemas.js';

export async function createReport(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await reportService.createReport(req.user!.userId, req.body as CreateReportInput);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function uploadPhotos(req: Request, res: Response, next: NextFunction) {
  try {
    const files = req.files as Express.Multer.File[];
    const type = (req.query.type as 'before' | 'after') || 'before';
    const result = await reportService.uploadPhotos(String(req.params.id), req.user!.userId, files, type);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getReport(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await reportService.getReport(
      String(req.params.bookingId),
      req.user!.userId,
      req.user!.role
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function updateReport(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await reportService.updateReport(
      String(req.params.id),
      req.user!.userId,
      req.body as UpdateReportInput
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function approveReport(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await reportService.approveReportById(String(req.params.id), req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
