import db from '../../configs/db';

const { Schema, model } = db;

export interface IRefreshToken {
  userId: string;
  tokenId: string;
}

export const refreshTokenSchema = new Schema<IRefreshToken>({
  userId: {
    type: String,
    required: true,
  },
  tokenId: {
    type: String,
    required: true,
  },
});

export const RefreshTokenModel = model<IRefreshToken>('refresh-tokens', refreshTokenSchema);