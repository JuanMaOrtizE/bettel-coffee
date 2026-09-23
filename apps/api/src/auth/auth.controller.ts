import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from './auth.constants.js';
import { AuthService } from './auth.service.js';
import { loginSchema, type LoginInput } from './schemas/login.schema.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body({ schema: loginSchema }) credentials: LoginInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(credentials);

    const isProduction =
      this.configService.getOrThrow<string>('NODE_ENV') === 'production';

    const accessTtlSeconds = Number(
      this.configService.getOrThrow('JWT_ACCESS_TTL_SECONDS'),
    );

    const refreshTtlSeconds = Number(
      this.configService.getOrThrow('JWT_REFRESH_TTL_SECONDS'),
    );

    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: accessTtlSeconds * 1000,
      path: '/',
    });

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: refreshTtlSeconds * 1000,
      path: '/auth',
    });

    return { user };
  }
}
