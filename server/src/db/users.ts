import { IUser } from '../models/users';
// import bcrypt from 'bcrypt';

const users: IUser[] = [
  {
    id: 1,
    userName: 'fakeUser',
    location: 'Kyiv',
    password: '$2b$10$KXEM7SI/UxxWovadi/enY.PMsHmfURj1Fn5WpvBK5KAqwx8VLzfXe',
  }
];

(async function () {
  // console.log(await bcrypt.hash('123', 10));
})();

export default users;