import { Request, Response } from 'express';
import { IUser } from '@interfaces/common/users';
import { UserModel } from '@models/users';
import { getNormalizedResponseBody } from '@services/get-normalized-response-data';

export interface IGetUserResponseUser {
  id: string;
  location: string;
  userName: string;
}

export async function getUser(req: Request, res: Response): Promise<Response> {
  const { userId } = req.params;
  
  try {
    const selectedUser: IUser | null = await UserModel
      .findById(userId, '_id userName location')
      .exec();
  
    if (selectedUser) {
      const { _id, userName, location } = selectedUser;
      const responseUser: IGetUserResponseUser = {
        id: String(_id),
        userName,
        location,
      };
      
      const resBody = getNormalizedResponseBody(
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
        .json(getNormalizedResponseBody(null, { message: 'User founded! [GET]' }));
    }
  } catch (e) {
    console.log('/getUser e: ', e);
  }
}

export default {
  getUser,
};