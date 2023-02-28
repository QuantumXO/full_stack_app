import db from '@configs/db';
import { IRefreshToken } from '@interfaces/common/refresh-token';

const { Schema, model } = db;

export const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    required: true,
  }
});

export const RefreshTokenModel = model<IRefreshToken>('refresh-tokens', refreshTokenSchema);