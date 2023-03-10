export interface IUser {
  id: string;
  userName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}
export interface IDBUser extends Omit<IUser, 'id'>{
  _id: string;
}
export interface ILoginResponseUser extends Pick<IUser, 'id' | 'password' | 'userName' | 'email'>{ }
export interface IDBCreateNewUser extends Pick<IUser, 'userName' | 'email' | 'password'> { }
export interface ISignUpResponseUser extends Omit<IUser, 'password'> { }
