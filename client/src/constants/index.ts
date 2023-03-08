import { TokenType } from '@models/common/token';

export const ACCESS_TOKEN_NAME: TokenType = 'access';
export const REFRESH_TOKEN_NAME: TokenType = 'refresh';
export const IS_DEV: boolean = process.env.NODE_ENV === 'development';