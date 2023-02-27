import jwt, { Algorithm } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { IRefreshToken, RefreshTokenModel } from '../models/common/refresh-token';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../constants';
import { Response } from 'express';

export type TokenType = 'access' | 'refresh';

interface ITokenProps {
  userId?: string;
}

interface IGetToken {
  token: string;
}

interface IJwtPayload {
  [key: string]: unknown;
  type: TokenType;
}

interface IAccessTokenPayload extends IJwtPayload {
  userId: string;
}
interface IRefreshTokenPayload extends IJwtPayload {
  id: string;
}

interface IGetAccessToken extends IGetToken {
  userId: string;
}

interface IGetRefreshToken extends IGetToken {
  id: string;
}

type GetAccessRefreshTokensType = {
  [key in TokenType]: string;
};

const accessTokenMaxAge: number = Number(process.env.ACCESS_TOKEN_MAX_AGE);
const refreshTokenMaxAge: number = Number(process.env.REFRESH_TOKEN_MAX_AGE);

export class Token {
  private readonly userId: string | undefined;
  
  constructor({ userId }: ITokenProps) {
    this.userId = userId;
  }
  
  private throwUserIdError(): void {
    if (!this.userId) {
      throw new Error('this.userId not found');
    }
  }
  
  public get getNewAccessToken(): IGetAccessToken {
    this.throwUserIdError();
    const token: string = jwt.sign(
      <IJwtPayload>{
        userId: this.userId,
        type: ACCESS_TOKEN_NAME,
      },
      process.env.TOKEN_SECRET,
      {
        algorithm: process.env.TOKEN_ALGORITHM as Algorithm,
        expiresIn: process.env.ACCESS_TOKEN_MAX_AGE
      }
    );
    return {
      token,
      userId: this.userId,
    };
  }
  
  public get getNewRefreshToken(): IGetRefreshToken {
    const tokenId: string = uuidv4();
    
    const token: string = jwt.sign(
      <IJwtPayload>{
        id: tokenId,
        type: REFRESH_TOKEN_NAME,
      },
      process.env.TOKEN_SECRET,
      {
        algorithm: process.env.TOKEN_ALGORITHM as Algorithm,
        expiresIn: process.env.REFRESH_TOKEN_MAX_AGE,
      }
    );
    return {
      token,
      id: tokenId
    }
  }
  
  public async replaceDbRefreshToken(tokenId: string): Promise<void> {
    this.throwUserIdError();
    this.deleteDbRefreshToken();
    
    await RefreshTokenModel.create({
      tokenId,
      userId: this.userId,
      // expireAt: new Date(Date.now() + refreshTokenMaxAge),
      expireAt: new Date(Date.now() + 1000),
    });
  }
  
  public deleteDbRefreshToken(): void {
    this.throwUserIdError();
    RefreshTokenModel.findOneAndRemove({ userId: this.userId }).exec();
  }
  
  public get getAccessRefreshTokens(): GetAccessRefreshTokensType {
    this.throwUserIdError();
    return ({
      access: this.getNewAccessToken.token,
      refresh: this.getNewRefreshToken.token,
    });
  }
  
  public async updateAccessRefreshTokens(): Promise<GetAccessRefreshTokensType> {
    const accessToken: IGetAccessToken = this.getNewAccessToken;
    const refreshToken: IGetRefreshToken = this.getNewRefreshToken;
    
    await this.replaceDbRefreshToken(refreshToken.id);
    
    return {
      access: accessToken.token,
      refresh: refreshToken.token,
    }
  }
  
  public getDecoded(token: string): string | jwt.JwtPayload {
    return jwt.verify(token, process.env.TOKEN_SECRET, { algorithms: [process.env.TOKEN_ALGORITHM as Algorithm] });
  }
  
  public async getDbRefreshToken(tokenId: string): Promise<IRefreshToken | undefined> {
    let result: IRefreshToken | undefined;
    
    if (tokenId) {
      result = await RefreshTokenModel.findOne({ tokenId }).exec();
    }
    
    return result;
  }
  
  public setCookieTokens(accessToken: string, refreshToken: string, res: Response): Response {
    return res
      .cookie(ACCESS_TOKEN_NAME, accessToken, {
        httpOnly: false,
        maxAge: accessTokenMaxAge,
      })
      .cookie(REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: true,
        maxAge: refreshTokenMaxAge,
      });
  }
  
  public removeCookieTokens(res: Response): Response {
    return res
      .clearCookie(ACCESS_TOKEN_NAME)
      .clearCookie(REFRESH_TOKEN_NAME);
  }
}
