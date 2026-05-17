import { Request, Response, NextFunction } from 'express';
import * as customerService from './service.js';
import type { UpdateProfileInput, ComplaintInput } from './service.js';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await customerService.getProfile(req.user!.userId) }); } catch (e) { next(e); }
};
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await customerService.updateProfile(req.user!.userId, req.body as UpdateProfileInput) }); } catch (e) { next(e); }
};
export const submitComplaint = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await customerService.submitComplaint(req.user!.userId, req.body as ComplaintInput) }); } catch (e) { next(e); }
};
export const getComplaints = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await customerService.getMyComplaints(req.user!.userId) }); } catch (e) { next(e); }
};
