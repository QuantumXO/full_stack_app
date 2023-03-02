import db from '../configs/db';
import { IUser } from '@interfaces/common/users';

const { Schema, model } = db;

export const userSchema = new Schema<IUser>({
  userName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255,
    minLength: 2,
  },
  location: {
    type: String,
    maxLength: 255,
    minLength: 2,
  },
  password: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 255,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
  },
});

export const UserModel = model<IUser>('users', userSchema);