import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Session, SessionStatus } from '../models/Session';
import { User } from '../models/User';

export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    const requesterId = req.user?.id;
    const { recipientId, scheduledTime, meetingLink } = req.body;

    if (!requesterId || !recipientId) {
      return res.status(400).json({ message: 'Requester and Recipient IDs are required.' });
    }

    if (requesterId === recipientId) {
      return res.status(400).json({ message: 'You cannot request a session with yourself.' });
    }

    const recipientExists = await User.findById(recipientId);
    if (!recipientExists) {
      return res.status(404).json({ message: 'Recipient user not found.' });
    }

    const newSession = await Session.create({
      requesterId,
      recipientId,
      status: 'requested',
      scheduledTime: scheduledTime ? new Date(scheduledTime) : new Date(Date.now() + 86400000), // Default tomorrow
      meetingLink: meetingLink || 'https://meet.jit.si/skillswap-' + Math.random().toString(36).substring(7),
    });

    const populatedSession = await Session.findById(newSession._id)
      .populate('requesterId', 'name email skillsOffered skillsWanted points')
      .populate('recipientId', 'name email skillsOffered skillsWanted points');

    return res.status(201).json(populatedSession);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating session.', error: (error as Error).message });
  }
};

export const getUserSessions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const sessions = await Session.find({
      $or: [{ requesterId: userId }, { recipientId: userId }],
    })
      .populate('requesterId', 'name email skillsOffered skillsWanted points')
      .populate('recipientId', 'name email skillsOffered skillsWanted points')
      .sort({ createdAt: -1 });

    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching sessions.', error: (error as Error).message });
  }
};

export const updateSessionStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, scheduledTime, meetingLink } = req.body;

    const validStatuses: SessionStatus[] = ['requested', 'confirmed', 'completed', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Allowed values: ${validStatuses.join(', ')}` });
    }

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    const previousStatus = session.status;
    if (status) session.status = status;
    if (scheduledTime) session.scheduledTime = new Date(scheduledTime);
    if (meetingLink !== undefined) session.meetingLink = meetingLink;

    await session.save();

    // Trigger Points Award (+50 points to both users on completion)
    if (status === 'completed' && previousStatus !== 'completed') {
      await User.findByIdAndUpdate(session.requesterId, { $inc: { points: 50 } });
      await User.findByIdAndUpdate(session.recipientId, { $inc: { points: 50 } });
    }

    const updatedSession = await Session.findById(id)
      .populate('requesterId', 'name email skillsOffered skillsWanted points')
      .populate('recipientId', 'name email skillsOffered skillsWanted points');

    return res.status(200).json(updatedSession);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating session status.', error: (error as Error).message });
  }
};
