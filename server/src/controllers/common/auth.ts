import { Request, Response } from 'express';
import { UserModel } from '@models/common/users';
import { IDBCreateNewUser, ILoginResponseUser, ISignUpResponseUser, IDBUser } from '@interfaces/common/users';
import bcrypt from 'bcrypt';
import Token from '@services/token';
import dotenv from 'dotenv';
import { get, size } from 'lodash';
import NotificationsController from '@controllers/common/notifications';
import { TokenType } from '@interfaces/common/token';
import { User } from '@services/validations/auth/sign-up';
import { validation } from '@services/validations';
import { normalizeResponseBody, responseBodyWithError } from '@services/normalize-response-body';
import { NotificationsEvents } from '@interfaces/common/notifications';
import { USER_PASSWORD_SALT_ROUNDS } from '@src/constants';
import customError from '@services/custom-error';

dotenv.config();

async function login(req: Request, res: Response): Promise<Response> {
  const { username, password } = req.body;
  
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'username or password is missing' });
    } else {
      const selectedUser: IDBUser | null = await UserModel
        .findOne({ userName: username })
        .lean()
        .select('_id userName password email')
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
            email: selectedUser.email,
          };
        
          const {
            access: accessToken,
            refresh: refreshToken
          } = await Token.updateAccessRefreshTokens(responseUser.id);
        
          const responseWithCookies: Response = Token.setCookieTokens(accessToken, refreshToken, res);
        
          try {
            await NotificationsController.createNotification(
              NotificationsEvents.USER_LOGIN,
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
  const { username, password, repeatPassword, email } = req.body;
  
  try {
    const { errors } = await validation(
      {
        ValidatorClass: User,
        fields: {
          username,
          password,
          repeatPassword,
          email
        },
      }
    );
    
    if (size(errors)) {
      return res.status(400).json({ errors });
    } else {
      const selectedUser: IDBUser | null = await UserModel
        .findOne({ userName: username })
        .exec();
      
      if (selectedUser) {
        return res
          .status(409)
          .json(responseBodyWithError(`${username} already exist`));
      } else {
        try {
          const hashPassword: string = await bcrypt.hash(password, USER_PASSWORD_SALT_ROUNDS);
  
          const newUser: IDBCreateNewUser = {
            userName: username,
            password: hashPassword,
            email
          };
          const createdUser = await UserModel.create(newUser);
          
          if (createdUser) {
            const { _id, userName, email, createdAt } = createdUser;
            const responseUser: ISignUpResponseUser = {
              id: String(_id),
              userName,
              email,
              createdAt
            };
  
            try {
              await NotificationsController.createNotification(
                NotificationsEvents.USER_CREATED,
                { userId: responseUser.id }
              );
            } catch (e) {
              console.log('e');
            }
            
            const {
              access: accessToken,
              refresh: refreshToken
            } = await Token.updateAccessRefreshTokens(responseUser.id);
  
            const responseWithCookies: Response = Token.setCookieTokens(accessToken, refreshToken, res);
            
            return responseWithCookies
              .status(200)
              .json(normalizeResponseBody(
                { user: responseUser },
                { message: 'SignUp is done! [POST]' }
              ));
          } else {
            //
          }
        } catch (e) {
          customError(null, 'bcrypt hash error', true);
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
}

async function logOut(req: Request, res: Response): Promise<Response> {
  const { cookies } = req;
  const accessTokenName: TokenType = 'access';
  
  const accessToken = cookies[accessTokenName];
  const decoded = Token.getDecoded(accessToken);
  const userId = get(decoded, 'userId');
  
  Token.deleteDbRefreshToken(userId);
  
  const responseWithoutCookies: Response = Token.removeCookieTokens(res);
  
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