import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { instanceToPlain } from 'class-transformer';
import { AuthUser } from '../../libs/dtos';
import { LoginUserDto, RegisterUserDto } from '../dtos';
import { UsersService } from './UserService';

import { UserEntity } from '../entities/UserEntity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateLogin(
    identifier: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.usersService.findByIdentifier(identifier);
    if (
      user &&
      user.password ===
        crypto.createHmac('sha256', user.salt + password).digest('hex')
    ) {
      return user;
    }
    throw new BadRequestException(`Invalid identifier or password`);
  }

  async loginUser(user: UserEntity) {
    const payload: AuthUser = {
      id: user.id,
      pseudo: user.username,
      mail: user.mail,
    };
    const tmpSignedPayload = this.jwtService.sign(payload);
    return {
      access_token: tmpSignedPayload,
      userInfo: instanceToPlain(user),
    };
  }

  async login(loginForm: LoginUserDto) {
    const user = await this.validateLogin(
      loginForm.identifier,
      loginForm.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload: AuthUser = {
      id: user.id,
      pseudo: user.username,
      mail: user.mail,
    };
    return {
      access_token: this.jwtService.sign(payload),
      userInfo: instanceToPlain(user),
    };
  }

  async signup(
    signUpForm: RegisterUserDto,
  ): Promise<{ access_token: string; userInfo: Record<string, any> } | void> {
    try {
      const user = await this.usersService.create(signUpForm);
      return await this.loginUser(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
