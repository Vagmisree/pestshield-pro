import { nanoid } from 'nanoid';
import { logger } from '../utils/logger.js';

export interface MockOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export async function createMockOrder(
  amountInPaise: number,
  receipt: string
): Promise<MockOrderResult> {
  const order = {
    id: `order_mock_${nanoid(14)}`,
    amount: amountInPaise,
    currency: 'INR',
    receipt,
  };
  logger.info(`[MockPayment] Order created: ${order.id} for ₹${amountInPaise / 100}`);
  return order;
}

export function verifyMockPayment(
  _orderId: string,
  paymentId: string,
  _signature: string
): boolean {
  // In mock mode, always return true if paymentId starts with 'pay_mock_'
  return paymentId.startsWith('pay_mock_');
}

export async function initiateMockRefund(
  paymentId: string,
  amountInPaise: number,
  reason: string
): Promise<{ id: string }> {
  const refundId = `refund_mock_${nanoid(10)}`;
  logger.info(`[MockPayment] Refund initiated: ${refundId} for payment ${paymentId} — ₹${amountInPaise / 100} — ${reason}`);
  return { id: refundId };
}

// Legacy aliases for backward compat
export const createRazorpayOrder = createMockOrder;
export const verifyPaymentSignature = verifyMockPayment;
export const initiateRefund = initiateMockRefund;
export function verifyWebhookSignature(_body: string, _sig: string): boolean { return true; }
export function getRazorpay() { return null; }
