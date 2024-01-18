import {
  IsNotEmpty,
  IsEmail,
  IsBoolean,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  img?: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsBoolean()
  gender: boolean;

  @IsNotEmpty()
  @IsString()
  dob: string;
}
