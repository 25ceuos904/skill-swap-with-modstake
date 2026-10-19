import { Router } from 'express';
import { getUserById, updateUserProfile, searchUsers } from '../controllers/userController';
import { getUserMatches } from '../controllers/matchController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Search users route (must be before :id to prevent matching 'search' as an ID)
router.get('/search', authMiddleware, searchUsers);

// Match score route
router.get('/:id/matches', authMiddleware, getUserMatches);

// User profile routes
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, updateUserProfile);

export default router;
