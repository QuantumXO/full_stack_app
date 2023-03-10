import {
  IsEmail, Length, IsString, Matches
} from 'class-validator';
import { Match } from '@services/validations/decorators/match';
import { VALID_USER_PASSWORD_REGEXP } from '@constants/validation';

export class User {
  @IsString()
  @Length(3, 15)
  username: string;
  
  @IsString()
  @Length(4, 10)
  @Matches(
    VALID_USER_PASSWORD_REGEXP,
    { message: 'password should not contain symbols: ` < > { } [ ] ( ) " \'' }
  )
  password: string;
  
  @IsString()
  @Length(4, 20)
  @Match('password')
  repeatPassword: string;
  
  @IsEmail()
  email: string;
}