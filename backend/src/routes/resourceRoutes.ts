import { Router } from 'express';
import { createResource, getResources } from '../controllers/resourceController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createResource);
router.get('/', authMiddleware, getResources);

export default router;
