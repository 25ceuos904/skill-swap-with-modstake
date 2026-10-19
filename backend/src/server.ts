import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import sessionRoutes from './routes/sessionRoutes';
import resourceRoutes from './routes/resourceRoutes';
import portfolioRoutes from './routes/portfolioRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/portfolio', portfolioRoutes);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'SkillSwap API is healthy & running' });
});

// Centralized Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error Middleware]:', err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 SkillSwap Server running on port ${PORT}`);
  console.log(`=================================`);
});

export default app;
