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
  @IsOptional()
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

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  img?: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsBoolean()
  gender: boolean;

  @IsOptional()
  @IsString()
  dob: string;
}
