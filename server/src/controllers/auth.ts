import { Request, Response } from 'express';
import { IUser, UserModel } from '../models/users';
import bcrypt from 'bcrypt';
import { Token } from '../services/token';
import { ILoginResultUser } from '../models/auth';
import dotenv from 'dotenv';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '../constants';

dotenv.config();

async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  
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
        const resultUser: ILoginResultUser = {
          id: String(selectedUser._id),
          userName: selectedUser.userName,
          password: selectedUser.password,
          location: selectedUser.location
        };
  
        const {
          access: accessToken,
          refresh: refreshToken
        } = await new Token({ userId: resultUser.id }).updateAccessRefreshTokens();
  
        const accessTokenMaxAge: number = Number(process.env.ACCESS_TOKEN_MAX_AGE);
        const refreshTokenMaxAge: number = Number(process.env.REFRESH_TOKEN_MAX_AGE);
        
        return res
          .cookie(ACCESS_TOKEN_NAME, accessToken, {
            httpOnly: true,
            maxAge: accessTokenMaxAge,
          })
          .cookie(REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: false,
            maxAge: refreshTokenMaxAge,
          })
          .status(200)
          .json({
            user: resultUser,
            message: 'Login is done! [POST]'
          });
      } else {
        res.status(400).json({ error: 'Incorrect password or username' });
      }
    } else {
      return res.status(401).json({ error: 'User not found' });
    }
  }
}

async function signUp(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;
  
  try {
    const selectedUser: IUser | null = await UserModel
      .findOne({ userName: username })
      .exec();
    
    if (!username || !password) {
      res.status(400).json({ error: 'Incorrect password or username' });
    } else {
      if (selectedUser) {
        res
          .status(401)
          .json({ message: `${username} already exist` });
      } else {
      
      }
    }
    
    res
      .status(200)
      .json({ message: 'SignUp is done! [POST]' });
  } catch (e) {
    console.log(e);
  }
}

async function logOut(req: Request, res: Response): Promise<void> {
  try {
    res
      .clearCookie(ACCESS_TOKEN_NAME)
      .clearCookie(REFRESH_TOKEN_NAME)
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