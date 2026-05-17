import { Router, type Router as RouterType } from 'express';
import * as shopController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { productQuerySchema, createProductSchema, updateProductSchema, checkoutSchema } from './schemas.js';

const router: RouterType = Router();

router.get('/products', validate(productQuerySchema, 'query'), shopController.getProducts);
router.get('/products/:slug', shopController.getProduct);
router.post('/products', authenticate, authorize('ADMIN'), validate(createProductSchema), shopController.createProduct);
router.patch('/products/:id', authenticate, authorize('ADMIN'), validate(updateProductSchema), shopController.updateProduct);
router.post('/cart/checkout', authenticate, authorize('CUSTOMER'), validate(checkoutSchema), shopController.checkout);
router.get('/orders', authenticate, shopController.getOrders);
router.get('/orders/:id', authenticate, shopController.getOrder);
router.post('/orders/:id/ship', authenticate, authorize('ADMIN'), shopController.shipOrder);

export default router;
