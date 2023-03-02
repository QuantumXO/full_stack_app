import db from '@configs/db';
import { IDbRefreshToken } from '@interfaces/common/token';

const { Schema, model } = db;

export const refreshTokenSchema = new Schema<IDbRefreshToken>({
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

export const RefreshTokenModel = model<IDbRefreshToken>('refresh-tokens', refreshTokenSchema);