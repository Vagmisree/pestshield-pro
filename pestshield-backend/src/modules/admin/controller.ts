import { Request, Response, NextFunction } from 'express';
import * as adminService from './service.js';
import type { ReassignInput, UpdateComplaintInput, CreateCouponInput, UpdateCouponInput, BroadcastInput, RevenueQuery, AdminBookingsQuery } from './schemas.js';

export const getDashboard = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await adminService.getDashboard() }); } catch (e) { next(e); }
};

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getAdminBookings(req.query as unknown as AdminBookingsQuery);
    if ('csv' in result) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
      res.send(result.csv);
    } else {
      res.json({ success: true, data: result });
    }
  } catch (e) { next(e); }
};

export const reassignTechnician = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.reassignTechnician(String(req.params.id), req.body as ReassignInput, req.user!.userId);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};

export const getTechnicianPerformance = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await adminService.getTechnicianPerformance() }); } catch (e) { next(e); }
};

export const blockTechnician = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.blockTechnician(String(req.params.id), req.user!.userId);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};

export const getRevenue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getRevenue(req.query as unknown as RevenueQuery);
    if ('csv' in result) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=revenue.csv');
      res.send(result.csv);
    } else {
      res.json({ success: true, data: result });
    }
  } catch (e) { next(e); }
};

export const getComplaints = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await adminService.getComplaints() }); } catch (e) { next(e); }
};

export const getCustomers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getCustomers(Number(req.query.page) || 1, Number(req.query.limit) || 20);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await adminService.createCoupon(req.body as CreateCouponInput) }); } catch (e) { next(e); }
};

export const listCoupons = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await adminService.listCoupons() }); } catch (e) { next(e); }
};

export const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.updateCoupon(String(req.params.id), req.body as UpdateCouponInput);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};

export const getNotificationLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getNotificationLog(Number(req.query.page) || 1, Number(req.query.limit) || 50);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};

export const getAuditLog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await adminService.getAuditLog(Number(req.query.page) || 1, Number(req.query.limit) || 50);
    res.json({ success: true, data: result });
  } catch (e) { next(e); }
};

export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await adminService.getAnalytics() }); } catch (e) { next(e); }
};
