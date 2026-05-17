import { Router, type Router as RouterType } from 'express';
import * as slotsController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { availableSlotsSchema } from './schemas.js';

const router: RouterType = Router();

// GET /api/slots/available?date=2026-06-01&pincode=500001&pestType=COCKROACH
router.get('/available', validate(availableSlotsSchema, 'query'), slotsController.getAvailableSlots);

export default router;
