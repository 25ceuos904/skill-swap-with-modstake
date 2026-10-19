import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { computeMatchScore } from '../utils/matchScore';

export const getUserMatches = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id || req.user?.id;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch candidate users excluding the current user
    const candidates = await User.find({ _id: { $ne: userId } }).select('-passwordHash');

    const searchSkill = (req.query.skill as string || '').trim().toLowerCase();

    const matches = candidates.map((candidate) => {
      const matchDetails = computeMatchScore(
        { skillsOffered: currentUser.skillsOffered, skillsWanted: currentUser.skillsWanted },
        { skillsOffered: candidate.skillsOffered, skillsWanted: candidate.skillsWanted }
      );

      return {
        user: candidate,
        mutualScore: matchDetails.mutualScore,
        aSatisfaction: matchDetails.aSatisfaction,
        bSatisfaction: matchDetails.bSatisfaction,
        aOffersToB: matchDetails.aOffersToB,
        bOffersToA: matchDetails.bOffersToA,
      };
    });

    // Optional skill query filter
    let filteredMatches = matches;
    if (searchSkill) {
      filteredMatches = matches.filter((m) => {
        const candidateSkillsOffered = m.user.skillsOffered.map((s) => s.toLowerCase());
        const candidateSkillsWanted = m.user.skillsWanted.map((s) => s.toLowerCase());
        return (
          candidateSkillsOffered.some((s) => s.includes(searchSkill)) ||
          candidateSkillsWanted.some((s) => s.includes(searchSkill)) ||
          m.user.name.toLowerCase().includes(searchSkill)
        );
      });
    }

    // Sort descending by mutual match score
    filteredMatches.sort((a, b) => b.mutualScore - a.mutualScore);

    return res.status(200).json(filteredMatches);
  } catch (error) {
    return res.status(500).json({ message: 'Error calculating match scores.', error: (error as Error).message });
  }
};
