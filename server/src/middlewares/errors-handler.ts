import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../constants';

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

function errorsHandlerMiddleware(err: HttpException, req: Request, res: Response, next: NextFunction): void {
  if (err) {
    const { name, message } = err;
    
    if (name === 'UnauthorizedError') {
      res
        .clearCookie(ACCESS_TOKEN_NAME)
        .clearCookie(REFRESH_TOKEN_NAME)
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
    next();
  }
}

export default errorsHandlerMiddleware;

