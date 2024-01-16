import { IsNotEmpty, IsEmail, IsBoolean, IsString, IsOptional } from 'class-validator';
import { Unique } from 'typeorm';
export class CreateAdminDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Unique(['email'])
  email: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
