import { Router, type Router as RouterType } from 'express';
import * as bookingController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import {
  createBookingSchema,
  rescheduleSchema,
  cancelSchema,
  closeBookingSchema,
  bookingListQuerySchema,
} from './schemas.js';

const router: RouterType = Router();

// Public
router.get('/check-pincode/:pincode', bookingController.checkPincode);

// Authenticated
router.use(authenticate);

router.post('/', authorize('CUSTOMER'), validate(createBookingSchema), bookingController.createBooking);
router.post('/bulk-create', authorize('CUSTOMER'), bookingController.bulkCreate);
router.get('/', validate(bookingListQuerySchema, 'query'), bookingController.listBookings);
router.get('/:id', bookingController.getBooking);
router.patch('/:id/reschedule', authorize('CUSTOMER'), validate(rescheduleSchema), bookingController.rescheduleBooking);
router.patch('/:id/cancel', validate(cancelSchema), bookingController.cancelBooking);
router.post('/:id/approve-report', authorize('CUSTOMER'), bookingController.approveReport);
router.post('/:id/close', authorize('TECHNICIAN'), validate(closeBookingSchema), bookingController.closeBooking);
// Send OTP for job closure
router.post('/:id/send-otp', authorize('TECHNICIAN'), bookingController.sendClosureOtp);
// Technician marks arrived
router.post('/:id/arrive', authorize('TECHNICIAN'), bookingController.markArrived);

export default router;
