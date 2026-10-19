import { Router } from 'express';
import { getPortfolio } from '../controllers/portfolioController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/:userId', authMiddleware, getPortfolio);

export default router;
