import { Request, Response } from 'express';
import { IUser, UserModel } from '../models/users';
import bcrypt from 'bcrypt';
import { Token } from '../services/utils/token';

async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ message: 'username or password is missing' });
  } else {
    const user: IUser | null = await UserModel.findOne({ userName: username }).exec();
    
    if (user) {
      const isValidPassword: boolean = await bcrypt.compare(
        password,
        user.password
      );
      
      if (isValidPassword) {
        const accessTokenMaxAge: number = 86400000 // 1d is ms
        const refreshTokenMaxAge: number = 2592000000 // 30d is ms
        
        const accessToken: string = new Token({
          userId: user.id,
          expirationTime: '1d',
          // expirationTime: '1s',
        }).getNewAccessToken;
        
        const refreshToken: string = new Token({
          expirationTime: '30d',
          // expirationTime: '1s',
        }).getNewRefreshToken;
        
        return res
          .cookie('jwt', accessToken, {
            httpOnly: true,
            maxAge: accessTokenMaxAge,
          })
          .cookie('refreshToken', refreshToken, {
            httpOnly: false,
            maxAge: refreshTokenMaxAge,
          })
          .status(200)
          .json({
            user: {
              id: user.id,
              username: user.userName,
              location: user.location,
            },
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


async function logout(req: Request, res: Response): Promise<void> {
  try {
    res
      .clearCookie('jwt')
      .clearCookie('refreshToken')
      .status(200)
      .json({ message: 'Logout is done! [POST]' })
      .end();
  } catch (e) {
    console.log(e);
  }
}

export default {
  login,
  logout,
};