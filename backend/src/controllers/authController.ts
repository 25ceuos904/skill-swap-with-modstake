import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const generateToken = (id: string, email: string) => {
  const secret = process.env.JWT_SECRET || 'skillswap_super_secret_jwt_key_2026';
  return jwt.sign({ id, email }, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, skillsOffered, skillsWanted, bio, education } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      skillsOffered: Array.isArray(skillsOffered) ? skillsOffered : [],
      skillsWanted: Array.isArray(skillsWanted) ? skillsWanted : [],
      bio: bio || '',
      education: education || '',
      points: 0,
    });

    const token = generateToken(newUser._id.toString(), newUser.email);

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      skillsOffered: newUser.skillsOffered,
      skillsWanted: newUser.skillsWanted,
      bio: newUser.bio,
      education: newUser.education,
      points: newUser.points,
      createdAt: newUser.createdAt,
    };

    return res.status(201).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error registering user.', error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id.toString(), user.email);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      skillsOffered: user.skillsOffered,
      skillsWanted: user.skillsWanted,
      bio: user.bio,
      education: user.education,
      points: user.points,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      token,
      user: userResponse,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error logging in.', error: (error as Error).message });
  }
};
