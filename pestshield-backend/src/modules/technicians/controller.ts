import { Request, Response, NextFunction } from 'express';
import * as techService from './service.js';
import type { CreateTechnicianInput, UpdateTechnicianInput, UpdateLocationInput, TechnicianListQuery } from './schemas.js';

export async function listTechnicians(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await techService.listTechnicians(req.query as unknown as TechnicianListQuery);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getTechnician(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await techService.getTechnicianById(String(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function createTechnician(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await techService.createTechnician(req.body as CreateTechnicianInput);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function updateTechnician(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await techService.updateTechnician(String(req.params.id), req.body as UpdateTechnicianInput);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function updateLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await techService.updateLocation(String(req.params.id), req.body as UpdateLocationInput);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await techService.getTechnicianTasks(String(req.params.id));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function markArrived(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await techService.markArrived(req.user!.userId, String(req.params.bookingId));
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getLiveMap(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await techService.getLiveMap();
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getMyJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await techService.getTechnicianTasks(req.user!.userId);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
