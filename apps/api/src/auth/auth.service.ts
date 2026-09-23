import { createHash, randomUUID } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service.js';
import { AuthSessionsService } from './auth-sessions.service.js';
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from './auth-token.types.js';
import type { LoginInput } from './schemas/login.schema.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly authSessionsService: AuthSessionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateCredentials(credentials: LoginInput) {
    const user = await this.userService.findByUsername(credentials.username);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordIsValid = await argon2.verify(
      user.passwordHash,
      credentials.password,
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
    };
  }

  async login(credentials: LoginInput) {
    const user = await this.validateCredentials(credentials);
    const sessionId = randomUUID();

    const refreshTtlSeconds = Number(
      this.configService.getOrThrow('JWT_REFRESH_TTL_SECONDS'),
    );

    const accessPayload = {
      sub: user.id,
      tokenType: 'access',
    } satisfies AccessTokenPayload;

    const refreshPayload = {
      sub: user.id,
      sid: sessionId,
      tokenType: 'refresh',
    } satisfies RefreshTokenPayload;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload),

      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshTtlSeconds,
      }),
    ]);

    const refreshTokenHash = createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    const expiresAt = new Date(Date.now() + refreshTtlSeconds * 1000);

    await this.authSessionsService.create({
      id: sessionId,
      userId: user.id,
      refreshTokenHash,
      expiresAt,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
