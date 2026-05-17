import { Request, Response, NextFunction } from 'express';
import * as paymentService from './service.js';
import { verifyWebhookSignature } from '../../integrations/razorpay.js';
import { createError } from '../../middleware/errorHandler.js';
import type { CreateOrderInput, VerifyPaymentInput, RefundInput } from './schemas.js';

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentService.createOrder(req.user!.userId, req.body as CreateOrderInput);
    res.status(201).json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function verifyPayment(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentService.verifyPayment(req.user!.userId, req.body as VerifyPaymentInput);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function webhook(req: Request, res: Response, next: NextFunction) {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = JSON.stringify(req.body);

    if (!verifyWebhookSignature(rawBody, signature)) {
      throw createError('Invalid webhook signature', 400, 'INVALID_SIGNATURE');
    }

    const { event, payload } = req.body;
    await paymentService.handleWebhook(event, payload);
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function processRefund(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentService.processRefund(req.body as RefundInput);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function getInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentService.getInvoice(
      String(req.params.bookingId),
      req.user!.userId,
      req.user!.role
    );
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
