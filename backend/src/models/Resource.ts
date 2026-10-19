import { Schema, model, Document, Types } from 'mongoose';

export interface IResource extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  link: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResource>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    link: { type: String, required: true, trim: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

export const Resource = model<IResource>('Resource', resourceSchema);
