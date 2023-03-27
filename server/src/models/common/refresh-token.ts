import { Schema, model } from 'mongoose';
import { IDbRefreshToken } from '@interfaces/common/token';
import dotenv from 'dotenv';

dotenv.config();

export const refreshTokenSchema = new Schema<IDbRefreshToken>({
  userId: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: Number(process.env.REFRESH_TOKEN_MAX_AGE) / 1000, // 30d, ms -> sec
  },
});

export const RefreshTokenModel = model<IDbRefreshToken>('refresh-tokens', refreshTokenSchema);