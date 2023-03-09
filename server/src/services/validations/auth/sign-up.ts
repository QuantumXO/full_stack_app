import {
  IsEmail, Length, IsString, Matches, MinLength, MaxLength
} from 'class-validator';
import { Match } from '@services/validations/decorators/match';

export class User {
  @IsString()
  @Length(3, 15)
  username: string;
  
  @IsString()
  @Length(4, 10)
  @Matches(
    /^[^`<>{}\[\]()"']{4,10}$/sg,
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