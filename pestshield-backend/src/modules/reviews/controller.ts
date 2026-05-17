import { Request, Response, NextFunction } from 'express';
import * as reviewService from './service.js';
import type { CreateReviewInput, ModerateReviewInput, ReviewQuery } from './schemas.js';

export const submitReview = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await reviewService.submitReview(req.user!.userId, req.body as CreateReviewInput) }); } catch (e) { next(e); }
};
export const getReviews = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await reviewService.getPublishedReviews(req.query as unknown as ReviewQuery) }); } catch (e) { next(e); }
};
export const moderateReview = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await reviewService.moderateReview(String(req.params.id), req.body as ModerateReviewInput) }); } catch (e) { next(e); }
};
export const getAggregate = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await reviewService.getAggregate() }); } catch (e) { next(e); }
};
