import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Resource } from '../models/Resource';
import { User } from '../models/User';

export const createResource = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, link, tags } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!title || !link) {
      return res.status(400).json({ message: 'Title and link URL are required.' });
    }

    const newResource = await Resource.create({
      userId,
      title,
      description: description || '',
      link,
      tags: Array.isArray(tags) ? tags : [],
    });

    // Trigger Points Award (+10 points for posting a resource)
    await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

    const populatedResource = await Resource.findById(newResource._id).populate('userId', 'name email points');

    return res.status(201).json(populatedResource);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating resource.', error: (error as Error).message });
  }
};

export const getResources = async (req: AuthRequest, res: Response) => {
  try {
    const tag = req.query.tag as string;
    const search = req.query.search as string;

    let filter: any = {};

    if (tag && tag.trim()) {
      filter.tags = { $in: [tag.trim()] };
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: { $regex: regex } }, { description: { $regex: regex } }, { tags: { $regex: regex } }];
    }

    const resources = await Resource.find(filter)
      .populate('userId', 'name email points')
      .sort({ createdAt: -1 });

    return res.status(200).json(resources);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching resources.', error: (error as Error).message });
  }
};
