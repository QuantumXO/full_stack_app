import { userSchema } from '../../models/users';

userSchema.methods.findUserByName = function () {
  return 'findUserByName method'
};