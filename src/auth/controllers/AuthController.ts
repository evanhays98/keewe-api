import { Body, Controller, Post } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from '../dtos';
import { AuthService } from '../services';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(@Body() loginForm: LoginUserDto) {
    return this.authService.login(loginForm);
  }

  @Post('register')
  async signUp(@Body() signUpForm: RegisterUserDto) {
    return this.authService.signup(signUpForm);
  }
}
