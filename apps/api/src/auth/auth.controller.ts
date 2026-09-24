import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
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

    const accessTtlSeconds = Number(
      this.configService.getOrThrow('JWT_ACCESS_TTL_SECONDS'),
    );

    const refreshTtlSeconds = Number(
      this.configService.getOrThrow('JWT_REFRESH_TTL_SECONDS'),
    );

    this.setAuthCookies(
      response,
      accessToken,
      refreshToken,
      accessTtlSeconds,
      refreshTtlSeconds,
    );

    return { user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken: unknown = request.cookies?.[REFRESH_TOKEN_COOKIE];

    if (typeof refreshToken !== 'string') {
      this.clearAuthCookies(response);
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    try {
      const result = await this.authService.refresh(refreshToken);

      this.setAuthCookies(
        response,
        result.accessToken,
        result.refreshToken,
        result.accessTtlSeconds,
        result.refreshTtlSeconds,
      );

      return { user: result.user };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.clearAuthCookies(response);
      }

      throw error;
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken: unknown = request.cookies?.[REFRESH_TOKEN_COOKIE];

    await this.authService.logout(
      typeof refreshToken === 'string' ? refreshToken : undefined,
    );

    this.clearAuthCookies(response);
  }

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
    accessTtlSeconds: number,
    refreshTtlSeconds: number,
  ) {
    const secure =
      this.configService.getOrThrow<string>('NODE_ENV') === 'production';

    response.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: accessTtlSeconds * 1000,
      path: '/',
    });

    response.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: refreshTtlSeconds * 1000,
      path: '/auth',
    });
  }

  private clearAuthCookies(response: Response) {
    const secure =
      this.configService.getOrThrow<string>('NODE_ENV') === 'production';

    response.clearCookie(ACCESS_TOKEN_COOKIE, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
    });

    response.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/auth',
    });
  }

}
