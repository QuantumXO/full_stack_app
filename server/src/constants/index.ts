import { TokenType } from '@interfaces/common/token';
import dotenv from 'dotenv';

dotenv.config();

export const ACCESS_TOKEN_NAME: TokenType = 'access';
export const REFRESH_TOKEN_NAME: TokenType = 'refresh';

export const ALLOWED_ORIGINS: string[] = (process.env.ALLOWED_ORIGINS as string).split(', ');