import { Schema, model } from 'mongoose';
import { IDBUser } from '@interfaces/common/users';

export const userSchema = new Schema<IDBUser>({
  userName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 255,
    minLength: 2,
  },
  email: {
    required: true,
    type: String,
    trim: true,
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

export const UserModel = model<IDBUser>('users', userSchema);