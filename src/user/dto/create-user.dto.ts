import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
  @IsNotEmpty()
  @IsString()
  role: string;
}
