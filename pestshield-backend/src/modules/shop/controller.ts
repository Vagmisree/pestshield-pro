import { Request, Response, NextFunction } from 'express';
import * as shopService from './service.js';
import type { ProductQuery, CreateProductInput, UpdateProductInput, CheckoutInput } from './schemas.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await shopService.getProducts(req.query as unknown as ProductQuery) }); } catch (e) { next(e); }
};
export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await shopService.getProductBySlug(String(req.params.slug)) }); } catch (e) { next(e); }
};
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await shopService.createProduct(req.body as CreateProductInput) }); } catch (e) { next(e); }
};
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await shopService.updateProduct(String(req.params.id), req.body as UpdateProductInput) }); } catch (e) { next(e); }
};
export const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try { res.status(201).json({ success: true, data: await shopService.checkout(req.user!.userId, req.body as CheckoutInput) }); } catch (e) { next(e); }
};
export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await shopService.getOrders(req.user!.userId, req.user!.role, Number(req.query.page) || 1) }); } catch (e) { next(e); }
};
export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await shopService.getOrderById(String(req.params.id), req.user!.userId, req.user!.role) }); } catch (e) { next(e); }
};
export const shipOrder = async (req: Request, res: Response, next: NextFunction) => {
  try { res.json({ success: true, data: await shopService.shipOrder(String(req.params.id)) }); } catch (e) { next(e); }
};
