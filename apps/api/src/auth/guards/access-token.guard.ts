import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ACCESS_TOKEN_COOKIE } from '../auth.constants.js';
import { AuthService } from '../auth.service.js';
import type { AuthenticatedRequest } from '../authenticated-request.type.js';

import { Reflector } from '@nestjs/core';
import {
  AUTH_REALM_KEY,
  type AuthRealm,
} from '../decorators/auth-realm.decorator.js';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authRealm = this.reflector.getAllAndOverride<AuthRealm>(
      AUTH_REALM_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (authRealm === 'public' || authRealm === 'platform') {
      return true;
    }
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const accessToken: unknown = request.cookies?.[ACCESS_TOKEN_COOKIE];

    if (typeof accessToken !== 'string') {
      throw new UnauthorizedException('No autenticado');
    }

    request.user = await this.authService.validateAccessToken(accessToken);

    return true;
  }
}
