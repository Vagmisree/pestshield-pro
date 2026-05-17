import { Router, type Router as RouterType } from 'express';
import * as reviewController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { createReviewSchema, moderateReviewSchema, reviewQuerySchema } from './schemas.js';

const router: RouterType = Router();

router.get('/aggregate', reviewController.getAggregate);
router.get('/', validate(reviewQuerySchema, 'query'), reviewController.getReviews);
router.post('/', authenticate, authorize('CUSTOMER'), validate(createReviewSchema), reviewController.submitReview);
router.patch('/:id/moderate', authenticate, authorize('ADMIN'), validate(moderateReviewSchema), reviewController.moderateReview);

export default router;
