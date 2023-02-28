import { Request, Response } from 'express';
import { UserModel } from '@models/users';
import { IUser } from '@interfaces//users';
import bcrypt from 'bcrypt';
import { Token, TokenType } from '@services/token';
import { ILoginResponseUser } from '@interfaces/auth';
import dotenv from 'dotenv';
import { get } from 'lodash';
import NotificationsController from '@controllers/notifications';

dotenv.config();

async function login(req: Request, res: Response): Promise<Response> {
  const { username, password } = req.body;
  
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'username or password is missing' });
    } else {
      const selectedUser: IUser | null = await UserModel
        .findOne({ userName: username })
        .lean()
        .select('_id userName password location')
        .exec();
    
      if (selectedUser) {
        const isValidPassword: boolean = await bcrypt.compare(
          password,
          selectedUser.password
        );
      
        if (isValidPassword) {
          const responseUser: ILoginResponseUser = {
            id: String(selectedUser._id),
            userName: selectedUser.userName,
            password: selectedUser.password,
            location: selectedUser.location
          };
        
          const {
            access: accessToken,
            refresh: refreshToken
          } = await new Token({ userId: responseUser.id }).updateAccessRefreshTokens();
        
          const responseWithCookies: Response = new Token({}).setCookieTokens(accessToken, refreshToken, res);
        
          try {
            await NotificationsController.createNotification(
              'USER_LOGIN',
              { userId: responseUser.id }
            );
          } catch (e) {
            console.log('e');
          }
        
          return responseWithCookies
            .status(200)
            .json({
              user: responseUser,
              message: 'Login is done! [POST]'
            });
        } else {
          res.status(400).json({ error: 'Incorrect password or username' });
        }
      } else {
        return res.status(401).json({ error: 'User not found' });
      }
    }
  } catch (e) {
    console.log('e: ', e);
  }
}

async function signUp(req: Request, res: Response): Promise<Response> {
  const { username, password } = req.body;
  
  try {
    const selectedUser: IUser | null = await UserModel
      .findOne({ userName: username })
      .exec();
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Incorrect password or username' });
    } else {
      if (selectedUser) {
        return res
          .status(401)
          .json({ message: `${username} already exist` });
      } else {
      
      }
    }
    
    return res
      .status(200)
      .json({ message: 'SignUp is done! [POST]' });
  } catch (e) {
    console.log(e);
  }
}

async function logOut(req: Request, res: Response): Promise<Response> {
  const { cookies } = req;
  const accessTokenName: TokenType = 'access';
  
  const accessToken = cookies[accessTokenName];
  const decoded = new Token({}).getDecoded(accessToken);
  const userId = get(decoded, 'userId');
  new Token({ userId }).deleteDbRefreshToken();
  const responseWithoutCookies: Response = new Token({}).removeCookieTokens(res);
  
  try {
    return responseWithoutCookies
      .status(200)
      .json({ message: 'Logout is done! [POST]' })
      .end();
  } catch (e) {
    console.log(e);
  }
}

export default {
  login,
  signUp,
  logOut,
};