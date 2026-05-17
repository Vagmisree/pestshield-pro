import { Router, type Router as RouterType } from 'express';
import * as customerController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { updateProfileSchema, complaintSchema } from './service.js';

const router: RouterType = Router();
router.use(authenticate, authorize('CUSTOMER'));

router.get('/me', customerController.getProfile);
router.patch('/me', validate(updateProfileSchema), customerController.updateProfile);
router.post('/complaints', validate(complaintSchema), customerController.submitComplaint);
router.get('/complaints', customerController.getComplaints);

export default router;
