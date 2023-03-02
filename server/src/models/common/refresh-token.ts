import { Schema, model } from 'mongoose';
import { IDbRefreshToken } from '@interfaces/common/token';

export const refreshTokenSchema = new Schema<IDbRefreshToken>({
  userId: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
});

export const RefreshTokenModel = model<IDbRefreshToken>('refresh-tokens', refreshTokenSchema);