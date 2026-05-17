import { Router, type Router as RouterType } from 'express';
import * as techController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import {
  createTechnicianSchema,
  updateTechnicianSchema,
  updateLocationSchema,
  technicianListQuerySchema,
} from './schemas.js';

const router: RouterType = Router();

router.use(authenticate);

router.get('/map', authorize('ADMIN'), techController.getLiveMap);
router.get('/me/jobs', authorize('TECHNICIAN'), techController.getMyJobs);
router.get('/', authorize('ADMIN'), validate(technicianListQuerySchema, 'query'), techController.listTechnicians);
router.post('/', authorize('ADMIN'), validate(createTechnicianSchema), techController.createTechnician);
router.get('/:id', techController.getTechnician);
router.patch('/:id', validate(updateTechnicianSchema), techController.updateTechnician);
router.patch('/:id/location', authorize('TECHNICIAN'), validate(updateLocationSchema), techController.updateLocation);
router.get('/:id/tasks', authorize('TECHNICIAN'), techController.getTasks);
router.patch('/:id/tasks/:bookingId/arrived', authorize('TECHNICIAN'), techController.markArrived);

export default router;
