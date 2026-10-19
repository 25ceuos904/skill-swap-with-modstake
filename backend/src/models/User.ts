import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  skillsOffered: string[];
  skillsWanted: string[];
  bio?: string;
  education?: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    skillsOffered: [{ type: String, trim: true }],
    skillsWanted: [{ type: String, trim: true }],
    bio: { type: String, default: '' },
    education: { type: String, default: '' },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', userSchema);
