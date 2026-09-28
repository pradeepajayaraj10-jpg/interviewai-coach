import mongoose, { Schema, Document } from 'mongoose';
import { IUserProfile } from './types.ts';

export interface IUserDocument extends Omit<IUserProfile, 'id'>, Document {
  id: string;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    college: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    skills: { type: [String], default: [] },
    targetRole: { type: String, required: true, trim: true },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Student (Pre-Final/Final Year)', '1-2 Years', 'Intern'],
      default: 'Fresher',
    },
    bio: { type: String, default: '' },
    updatedAt: { type: String, default: () => new Date().toISOString() },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
