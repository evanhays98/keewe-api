import { IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @IsString()
  mail: string;

  @IsString()
  password: string;
}

export class LoginUserDto {
  @IsString()
  identifier: string;

  @IsString()
  password: string;
}
