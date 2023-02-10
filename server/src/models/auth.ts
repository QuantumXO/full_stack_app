import { IUser } from './users';

export interface ILoginResultUser extends Pick<IUser, 'password' | 'userName' | 'location'>{
  id: string;
}