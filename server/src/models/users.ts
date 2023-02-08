import db from '../configs/db';

const { Schema, model } = db;

export interface IUser {
  id: number;
  userName: string;
  location: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}

export const userSchema = new Schema<IUser>({
  id: {
    type: Number,
    required: true,
  },
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