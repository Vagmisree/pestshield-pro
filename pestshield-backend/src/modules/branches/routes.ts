import { Router, type Router as RouterType } from 'express';
import * as branchController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { createBranchSchema, updatePincodesSchema } from './service.js';

const router: RouterType = Router();

router.get('/', branchController.getBranches);
router.get('/check-pincode/:pincode', branchController.checkPincode);
router.post('/', authenticate, authorize('ADMIN'), validate(createBranchSchema), branchController.createBranch);
router.patch('/:id/pincodes', authenticate, authorize('ADMIN'), validate(updatePincodesSchema), branchController.updatePincodes);

export default router;
