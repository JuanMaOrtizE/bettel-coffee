import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  AUTH_REALM_KEY,
  type AuthRealm,
} from '../../auth/decorators/auth-realm.decorator.js';
import type { AuthenticatedPlatformRequest } from '../authenticated-platform-request.type.js';
import { PLATFORM_ACCESS_TOKEN_COOKIE } from '../platform-auth.constants.js';
import { PlatformAuthService } from '../platform-auth.service.js';

@Injectable()
export class PlatformAccessTokenGuard implements CanActivate {
  constructor(
    private readonly platformAuthService: PlatformAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authRealm = this.reflector.getAllAndOverride<AuthRealm>(
      AUTH_REALM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (authRealm !== 'platform') {
      return true;
    }

    const request =
      context.switchToHttp().getRequest<AuthenticatedPlatformRequest>();

    const accessToken: unknown =
      request.cookies?.[PLATFORM_ACCESS_TOKEN_COOKIE];

    if (typeof accessToken !== 'string') {
      throw new UnauthorizedException('No autenticado');
    }

    request.platformAdmin =
      await this.platformAuthService.validateAccessToken(accessToken);

    return true;
  }
}
