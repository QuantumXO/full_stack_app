export type TokenType = 'access' | 'refresh';

export interface IGetToken {
  token: string;
}
export interface IJwtPayload {
  [key: string]: unknown;
  type: TokenType;
}
export interface IAccessTokenPayload extends IJwtPayload {
  userId: string;
}
export interface IRefreshTokenPayload extends IJwtPayload {
  id: string;
  userId: string;
}
export interface IGetAccessToken extends IGetToken {
  userId: string;
}
export interface IGetRefreshToken extends IGetToken {
  id: string;
}
export type GetAccessRefreshTokensType = {
  [key in TokenType]: string;
};
export interface IDbRefreshToken {
  userId: string;
  tokenId: string;
  expireAt: Date;
}