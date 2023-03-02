import { IUser } from '@interfaces/common/users';

export interface ILoginResponseUser extends Pick<IUser, 'password' | 'userName' | 'location'>{
  id: string;
}