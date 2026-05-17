import { Router, type Router as RouterType } from 'express';
import * as adminController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import {
  reassignSchema, createCouponSchema, updateCouponSchema,
  revenueQuerySchema, adminBookingsQuerySchema,
} from './schemas.js';

const router: RouterType = Router();
router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', adminController.getDashboard);
router.get('/bookings', validate(adminBookingsQuerySchema, 'query'), adminController.getBookings);
router.patch('/bookings/:id/reassign', validate(reassignSchema), adminController.reassignTechnician);
router.get('/technicians', adminController.getTechnicianPerformance);
router.post('/technicians/:id/block', adminController.blockTechnician);
router.get('/revenue', validate(revenueQuerySchema, 'query'), adminController.getRevenue);
router.get('/complaints', adminController.getComplaints);
router.get('/customers', adminController.getCustomers);
router.post('/coupons', validate(createCouponSchema), adminController.createCoupon);
router.get('/coupons', adminController.listCoupons);
router.patch('/coupons/:id', validate(updateCouponSchema), adminController.updateCoupon);
router.get('/notifications/log', adminController.getNotificationLog);
router.get('/audit-log', adminController.getAuditLog);
router.get('/analytics', adminController.getAnalytics);

export default router;
