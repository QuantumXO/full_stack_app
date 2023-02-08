import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface ITokenProps {
  userId?: number;
  expirationTime?: number | string;
}

export class Token {
  private token: string | undefined;
  private readonly userId: number | undefined;
  private readonly expirationTime: number | undefined | string;
  
  constructor({ userId, expirationTime }: ITokenProps) {
    this.userId = userId;
    this.expirationTime = expirationTime;
  }
  
  get getNewAccessToken(): string {
    return jwt.sign(
      {
        userId: this.userId,
        type: 'access',
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: this.expirationTime
      }
    );
  }
  
  get getNewRefreshToken(): string {
    return jwt.sign(
      {
        id: uuidv4(),
        type: 'refresh',
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: this.expirationTime || '30d',
      }
    );
  }
  
  get isValid(): boolean {
    return !!this.getPayload;
  }
  
  get getPayload(): string | jwt.JwtPayload {
    return jwt.verify(this.token, process.env.TOKEN_KEY);
  }
}
