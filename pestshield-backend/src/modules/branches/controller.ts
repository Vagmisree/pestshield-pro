import { Request, Response, NextFunction } from 'express';
import * as branchService from './service.js';
import type { CreateBranchInput, UpdatePincodesInput } from './service.js';

export const getBranches = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await branchService.getBranches() }); } catch (e) { next(e); }
};
export const checkPincode = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await branchService.checkPincode(String(req.params.pincode)) }); } catch (e) { next(e); }
};
export const createBranch = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await branchService.createBranch(req.body as CreateBranchInput) }); } catch (e) { next(e); }
};
export const updatePincodes = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await branchService.updatePincodes(String(req.params.id), req.body as UpdatePincodesInput) }); } catch (e) { next(e); }
};
