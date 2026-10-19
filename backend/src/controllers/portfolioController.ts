import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Session } from '../models/Session';
import { Resource } from '../models/Resource';
import { computeMatchScore } from '../utils/matchScore';

export const getPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 1. Fetch completed sessions involving user
    const completedSessions = await Session.find({
      $or: [{ requesterId: userId }, { recipientId: userId }],
      status: 'completed',
    })
      .populate('requesterId', 'name email skillsOffered skillsWanted')
      .populate('recipientId', 'name email skillsOffered skillsWanted')
      .sort({ updatedAt: -1 });

    // 2. Fetch resources posted by user
    const sharedResources = await Resource.find({ userId }).sort({ createdAt: -1 });

    // 3. Compute skillsLearned & skillsTaught
    const skillsLearnedSet = new Set<string>();
    const skillsTaughtSet = new Set<string>();

    completedSessions.forEach((sess) => {
      const requester = sess.requesterId as any;
      const recipient = sess.recipientId as any;

      if (!requester || !recipient) return;

      const matchRes = computeMatchScore(
        { skillsOffered: requester.skillsOffered || [], skillsWanted: requester.skillsWanted || [] },
        { skillsOffered: recipient.skillsOffered || [], skillsWanted: recipient.skillsWanted || [] }
      );

      if (requester._id.toString() === userId) {
        // User was requester -> learned skills from recipient (bOffersToA)
        matchRes.bOffersToA.forEach((s) => skillsLearnedSet.add(s));
        // Fallback: if no direct match recorded, include recipient's offered skills
        if (matchRes.bOffersToA.length === 0 && recipient.skillsOffered) {
          recipient.skillsOffered.forEach((s: string) => skillsLearnedSet.add(s));
        }
      } else if (recipient._id.toString() === userId) {
        // User was recipient -> taught skills to requester (bOffersToA for recipient)
        matchRes.bOffersToA.forEach((s) => skillsTaughtSet.add(s));
        if (matchRes.bOffersToA.length === 0 && user.skillsOffered) {
          user.skillsOffered.forEach((s: string) => skillsTaughtSet.add(s));
        }
      }
    });

    const portfolioData = {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        education: user.education,
        points: user.points,
        createdAt: user.createdAt,
      },
      skillsLearned: Array.from(skillsLearnedSet),
      skillsTaught: Array.from(skillsTaughtSet),
      completedSessions,
      sharedResources,
      totalPoints: user.points,
    };

    return res.status(200).json(portfolioData);
  } catch (error) {
    return res.status(500).json({ message: 'Error generating portfolio.', error: (error as Error).message });
  }
};
