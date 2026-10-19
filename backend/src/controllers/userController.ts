import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user profile.', error: (error as Error).message });
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    if (req.user?.id !== id) {
      return res.status(403).json({ message: 'Access denied. You can only update your own profile.' });
    }

    const { name, bio, education, skillsOffered, skillsWanted } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(education !== undefined && { education }),
        ...(skillsOffered && { skillsOffered: Array.isArray(skillsOffered) ? skillsOffered : [] }),
        ...(skillsWanted && { skillsWanted: Array.isArray(skillsWanted) ? skillsWanted : [] }),
      },
      { new: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating profile.', error: (error as Error).message });
  }
};

export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const skill = req.query.skill as string;
    let filter: any = {};

    if (skill && skill.trim()) {
      const regex = new RegExp(skill.trim(), 'i');
      filter = {
        $or: [{ skillsOffered: { $regex: regex } }, { skillsWanted: { $regex: regex } }, { name: { $regex: regex } }],
      };
    }

    const users = await User.find(filter).select('-passwordHash');
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error searching users.', error: (error as Error).message });
  }
};
