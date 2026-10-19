import { Schema, model, Document, Types } from 'mongoose';

export type SessionStatus = 'requested' | 'confirmed' | 'completed' | 'rejected';

export interface ISession extends Document {
  requesterId: Types.ObjectId;
  recipientId: Types.ObjectId;
  status: SessionStatus;
  scheduledTime?: Date;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['requested', 'confirmed', 'completed', 'rejected'],
      default: 'requested',
    },
    scheduledTime: { type: Date },
    meetingLink: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Session = model<ISession>('Session', sessionSchema);
