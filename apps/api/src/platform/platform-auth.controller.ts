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
import { Public } from '../auth/decorators/public.decorator.js';
import {
  PLATFORM_ACCESS_TOKEN_COOKIE,
  PLATFORM_REFRESH_TOKEN_COOKIE,
} from './platform-auth.constants.js';
import { PlatformAuthService } from './platform-auth.service.js';
import {
  platformLoginSchema,
  type PlatformLoginInput,
} from './schemas/platform-login.schema.js';

@Controller('platform/auth')
export class PlatformAuthController {
  constructor(
    private readonly platformAuthService: PlatformAuthService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body({ schema: platformLoginSchema })
    credentials: PlatformLoginInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { platformAdmin, accessToken, refreshToken } =
      await this.platformAuthService.login(credentials);

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

    return { platformAdmin };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken: unknown =
      request.cookies?.[PLATFORM_REFRESH_TOKEN_COOKIE];

    if (typeof refreshToken !== 'string') {
      this.clearAuthCookies(response);
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    try {
      const result = await this.platformAuthService.refresh(refreshToken);

      this.setAuthCookies(
        response,
        result.accessToken,
        result.refreshToken,
        result.accessTtlSeconds,
        result.refreshTtlSeconds,
      );

      return { platformAdmin: result.platformAdmin };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.clearAuthCookies(response);
      }

      throw error;
    }
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

    response.cookie(PLATFORM_ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: accessTtlSeconds * 1000,
      path: '/platform',
    });

    response.cookie(PLATFORM_REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      maxAge: refreshTtlSeconds * 1000,
      path: '/platform/auth',
    });
  }

  private clearAuthCookies(response: Response) {
    const secure =
      this.configService.getOrThrow<string>('NODE_ENV') === 'production';

    response.clearCookie(PLATFORM_ACCESS_TOKEN_COOKIE, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/platform',
    });

    response.clearCookie(PLATFORM_REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/platform/auth',
    });
  }
}
