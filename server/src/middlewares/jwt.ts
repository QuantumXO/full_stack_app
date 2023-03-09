import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../constants';
import dotenv from 'dotenv';
import Token from '@services/token';
import customError from '@services/get-custom-error';
import { Params as ExpressUnlessParamsType, unless } from 'express-unless';
import { IDbRefreshToken, TokenType } from '@interfaces/common/token';

dotenv.config();

const excludedPaths: string[] = ['/public', '/login', '/sign-up'];
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
      const decoded: string | jwt.JwtPayload = Token.getDecoded(accessToken);
      if (
        typeof decoded !== 'string' &&
        decoded?.type !== ACCESS_TOKEN_NAME
      ) {
        next(customError('UnauthorizedError', 'Invalid token... (access)'));
      }
    } catch (e) {
      next(e);
    }
  } else if (refreshToken) {
    try {
      const decoded: string | jwt.JwtPayload = Token.getDecoded(refreshToken);
      
      if (typeof decoded !== 'string') {
        const { type, id } = decoded || {};
        
        if (type !== REFRESH_TOKEN_NAME) {
          next(customError('UnauthorizedError', 'Invalid token... (refresh)'));
        }
        
        const dbRefreshToken: IDbRefreshToken | undefined = await Token.getDbRefreshToken(id);
        
        if (dbRefreshToken) {
          /*const { access, refresh } = await new Token({ userId: dbRefreshToken.userId })
            .updateAccessRefreshTokens();
          
            new Token({}).setCookieTokens(access, refresh, res);
         */

          console.log('dbRefreshToken: ', dbRefreshToken);
          
          const accessToken = await Token.getNewAccessToken(dbRefreshToken.userId);
  
          Token.setCookieToken(res, 'access', accessToken.token);
        } else {
          next(customError('UnauthorizedError', 'Invalid token... (refresh) (db)'));
        }
      }
    } catch (e) {
      next(e);
    }
  } else {
    next(customError('UnauthorizedError', 'Invalid tokens...'));
  }
  
  next();
}

jwtMiddleware.unless = unless;

export default jwtMiddleware;