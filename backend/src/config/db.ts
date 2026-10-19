import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillswap';
    const conn = await mongoose.connect(connStr);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database] Connection Error: ${(error as Error).message}`);
    // Allow process to run even if MongoDB isn't active locally for demo resilience
  }
};
