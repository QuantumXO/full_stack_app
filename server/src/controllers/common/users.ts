import { Request, Response } from 'express';
import { IDBUser, IUser } from '@interfaces/common/users';
import { UserModel } from '@models/users';
import { normalizeResponseBody } from '@services/normalize-response-body';

export interface IGetUserResponseUser {
  id: string;
  email: string;
  userName: string;
}

export async function getUser(req: Request, res: Response): Promise<Response> {
  const { userId } = req.params;
  
  try {
    const selectedUser: IDBUser | null = await UserModel
      .findById(userId, '_id userName location')
      .exec();
  
    if (selectedUser) {
      const { _id, userName, email } = selectedUser;
      const responseUser: IGetUserResponseUser = {
        id: String(_id),
        userName,
        email,
      };
      
      const resBody = normalizeResponseBody(
        {
          user: responseUser,
          message: 'User founded! [GET]',
        },
      );
      
      return res
        .status(200)
        .json(resBody);
    } else {
      return res
        .status(400)
        .json(normalizeResponseBody(null, { message: 'User founded! [GET]' }));
    }
  } catch (e) {
    console.log('/getUser e: ', e);
  }
}

export default {
  getUser,
};