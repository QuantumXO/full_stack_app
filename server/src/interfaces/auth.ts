import { IUser } from '@interfaces/users';

export interface ILoginResponseUser extends Pick<IUser, 'password' | 'userName' | 'location'>{
  id: string;
}