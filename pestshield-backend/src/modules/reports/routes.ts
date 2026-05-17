import { Router, type Router as RouterType } from 'express';
import multer from 'multer';
import * as reportController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { createReportSchema, updateReportSchema } from './schemas.js';
import { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from '../../config/constants.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  },
});

const router: RouterType = Router();

router.use(authenticate);

router.post('/', authorize('TECHNICIAN'), validate(createReportSchema), reportController.createReport);
router.post('/:id/photos', authorize('TECHNICIAN'), upload.array('photos', 10), reportController.uploadPhotos);
router.get('/:bookingId', reportController.getReport);
router.patch('/:id', authorize('TECHNICIAN'), validate(updateReportSchema), reportController.updateReport);
router.post('/:id/approve', authorize('CUSTOMER'), reportController.approveReport);

export default router;
