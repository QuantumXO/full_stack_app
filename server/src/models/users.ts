import { Schema, model } from 'mongoose';

export interface IUser {
  id: number;
  userName: string;
  location: string;
  password: string;
}

export const userSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

export const UserModel = model('User', userSchema);