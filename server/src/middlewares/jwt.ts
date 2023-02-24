import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Params as ExpressUnlessParamsType } from 'express-unless';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../constants';
import dotenv from 'dotenv';
import { unless } from 'express-unless';
import { Token, TokenType } from '../services/token';
import getCustomError from '../services/get-custom-error';
import { IRefreshToken } from '../models/common/refresh-token';

dotenv.config();

const excludedPaths: string[] = ['/public', '/login', '/logout', /*'/socket.io/'*/];
export const unlessParams: ExpressUnlessParamsType = {
  path: excludedPaths,
};

const jwtMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { cookies } = req;
  const accessTokenName: TokenType = 'access';
  const refreshTokenName: TokenType = 'refresh';
  
  const accessToken = cookies[accessTokenName];
  const refreshToken = cookies[refreshTokenName];
  
  if (accessToken) {
    try {
      const decoded: string | jwt.JwtPayload = new Token({}).getDecoded(accessToken);
      if (
        typeof decoded !== 'string' &&
        decoded?.type !== ACCESS_TOKEN_NAME
      ) {
        next(getCustomError('UnauthorizedError', 'Invalid token... (access)'));
      }
    } catch (e) {
      next(e);
    }
  } else if (refreshToken) {
    try {
      const decoded: string | jwt.JwtPayload = new Token({}).getDecoded(refreshToken);
      
      if (typeof decoded !== 'string') {
        const { type, id } = decoded || {};
        
        if (type !== REFRESH_TOKEN_NAME) {
          next(getCustomError('UnauthorizedError', 'Invalid token... (refresh)'));
        }
        
        const dbRefreshToken: IRefreshToken | undefined = await new Token({}).getDbRefreshToken(id);
        
        if (dbRefreshToken) {
          await new Token({ userId: dbRefreshToken.userId }).updateAccessRefreshTokens();
        } else {
          next(getCustomError('UnauthorizedError', 'Invalid token... (refresh) (db)'));
        }
      }
    } catch (e) {
      next(e);
    }
  } else {
    next(getCustomError('UnauthorizedError', 'Invalid tokens...'));
  }
  
  next();
}

jwtMiddleware.unless = unless;

export default jwtMiddleware;