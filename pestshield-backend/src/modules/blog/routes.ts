import { Router, type Router as RouterType } from 'express';
import * as blogController from './controller.js';
import { validate } from '../../middleware/validate.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { blogQuerySchema, createPostSchema, updatePostSchema } from './schemas.js';

const router: RouterType = Router();

router.get('/posts', validate(blogQuerySchema, 'query'), blogController.getPosts);
router.get('/posts/:slug', blogController.getPost);
router.get('/categories', blogController.getCategories);
router.post('/posts', authenticate, authorize('ADMIN'), validate(createPostSchema), blogController.createPost);
router.patch('/posts/:id', authenticate, authorize('ADMIN'), validate(updatePostSchema), blogController.updatePost);
router.delete('/posts/:id', authenticate, authorize('ADMIN'), blogController.deletePost);

export default router;
