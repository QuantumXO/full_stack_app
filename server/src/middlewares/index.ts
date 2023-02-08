import { expressjwt, Params as JwtParamsType, UnauthorizedError } from 'express-jwt';
import process from 'process';
import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Params as ExpressUnlessParamsType } from 'express-unless';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';

dotenv.config();

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

const jwtParams: JwtParamsType = {
  secret: process.env.TOKEN_KEY,
  algorithms: ['HS256'],
  onExpired: (req: Request, err: UnauthorizedError): void | Promise<void> => {
    const error = new Error('Token expired!');
    error.name = 'UnauthorizedError';
    
    throw error;
  },
  getToken: (req: Request): string | Promise<string> | undefined => {
    const { jwt: jwtFromCookies } = req?.cookies;
    
    if (jwtFromCookies) {
      jwt.verify(
        jwtFromCookies,
        process.env.TOKEN_KEY,
        function (err: VerifyErrors | null, decoded: jwt.JwtPayload | string): void {
          if (err) {
            return;
          } else if (typeof decoded !== 'string') {
            if (!decoded.iat) {
              return;
            }
          }
        });
    }
    
    return jwtFromCookies;
  },
};
const jwtUnlessParams: ExpressUnlessParamsType = {
  path: ['/public', '/login'],
};

export const expressJwtMiddleware = expressjwt(jwtParams).unless(jwtUnlessParams);

const originslist: string[] = ['http://localhost:3000'];
const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    if (originslist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // For legacy browser support
};

export const corsMiddleware = cors(corsOptions);

export function errorsHandlerMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction): void {
  if (err) {
    const { name, message } = err;
    // console.log('MIDDLEWARE error handler: ', message);
    
    if (name === 'UnauthorizedError') {
      res
        .clearCookie('jwt')
        .clearCookie('refreshToken')
        .status(401)
        .json({ errorName: name, message: 'Invalid token...' })
        .end();
    } else {
      res
        .status(500)
        .json({ errorName: name, message: message || 'Some error from server...' })
        .end();
    }
  } else {
    next(err);
  }
}

