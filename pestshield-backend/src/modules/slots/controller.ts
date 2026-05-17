import { Request, Response, NextFunction } from 'express';
import * as slotsService from './service.js';
import type { AvailableSlotsQuery } from './schemas.js';

export async function getAvailableSlots(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query as unknown as AvailableSlotsQuery;
    const result = await slotsService.getAvailableSlots(query);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
