import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;
}
