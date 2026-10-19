import { Router } from 'express';
import { createSession, getUserSessions, updateSessionStatus } from '../controllers/sessionController';
import { authMiddleware } from '../middleware/authMiddleware';
import { sessionAccessMiddleware } from '../middleware/sessionAccessMiddleware';

const router = Router();

router.post('/', authMiddleware, createSession);
router.get('/user/:id', authMiddleware, getUserSessions);
router.patch('/:id/status', authMiddleware, sessionAccessMiddleware, updateSessionStatus);

export default router;
