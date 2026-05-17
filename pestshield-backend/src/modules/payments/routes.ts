import { Router, type Router as RouterType } from 'express';
import * as paymentController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { createOrderSchema, verifyPaymentSchema, refundSchema } from './schemas.js';

const router: RouterType = Router();

// Razorpay webhook — no auth, raw body needed
router.post('/webhook', paymentController.webhook);

router.use(authenticate);

router.post('/create-order', authorize('CUSTOMER'), validate(createOrderSchema), paymentController.createOrder);
router.post('/verify', authorize('CUSTOMER'), validate(verifyPaymentSchema), paymentController.verifyPayment);
router.post('/refund', authorize('ADMIN'), validate(refundSchema), paymentController.processRefund);
router.get('/invoice/:bookingId', paymentController.getInvoice);

export default router;
