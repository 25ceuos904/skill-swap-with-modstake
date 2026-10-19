import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { Session } from '../models/Session';

export const sessionAccessMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const sessionId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    const isRequester = session.requesterId.toString() === userId;
    const isRecipient = session.recipientId.toString() === userId;

    if (!isRequester && !isRecipient) {
      return res.status(403).json({ message: 'Access denied. You are not a participant in this session.' });
    }

    // Attach session to request for downstream controller convenience
    (req as any).sessionInstance = session;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error checking session permissions.', error: (error as Error).message });
  }
};
