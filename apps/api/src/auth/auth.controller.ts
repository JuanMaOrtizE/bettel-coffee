import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { loginSchema, type LoginInput } from './schemas/login.schema.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body({ schema: loginSchema }) credentials: LoginInput) {
    return this.authService.validateCredentials(credentials);
  }
}
