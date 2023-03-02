export interface IUser {
  _id: number;
  userName: string;
  location: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
}
