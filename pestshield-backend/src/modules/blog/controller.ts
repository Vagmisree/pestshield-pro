import { Request, Response, NextFunction } from 'express';
import * as blogService from './service.js';
import type { BlogQuery, CreatePostInput, UpdatePostInput } from './schemas.js';

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await blogService.getPosts(req.query as unknown as BlogQuery) }); } catch (e) { next(e); }
};
export const getPost = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await blogService.getPostBySlug(String(req.params.slug)) }); } catch (e) { next(e); }
};
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await blogService.createPost(req.user!.userId, req.body as CreatePostInput) }); } catch (e) { next(e); }
};
export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await blogService.updatePost(String(req.params.id), req.body as UpdatePostInput) }); } catch (e) { next(e); }
};
export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await blogService.deletePost(String(req.params.id)) }); } catch (e) { next(e); }
};
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await blogService.getCategories() }); } catch (e) { next(e); }
};
