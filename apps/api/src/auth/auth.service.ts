import { createHash, randomUUID } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service.js';
import { AuthSessionsService } from './auth-sessions.service.js';
import {
  refreshTokenClaimsSchema,
  type AccessTokenPayload,
  type RefreshTokenPayload,
} from './auth-token.schemas.js';
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

    const refreshTokenHash = this.hashToken(refreshToken);

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

  async refresh(refreshToken: string) {
    const refreshSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

    let decodedToken: unknown;

    try {
      decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: refreshSecret,
        algorithms: ['HS256'],
      });
    } catch {
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    const parsedClaims = refreshTokenClaimsSchema.safeParse(decodedToken);

    if (!parsedClaims.success) {
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    const claims = parsedClaims.data;
    const session = await this.authSessionsService.findById(claims.sid);
    const now = new Date();

    if (
      !session ||
      session.userId !== claims.sub ||
      session.revokedAt ||
      session.expiresAt <= now ||
      !session.user.isActive
    ) {
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    const remainingSessionSeconds = Math.floor(
      (session.expiresAt.getTime() - now.getTime()) / 1000,
    );

    if (remainingSessionSeconds <= 0) {
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    const configuredAccessTtlSeconds = Number(
      this.configService.getOrThrow('JWT_ACCESS_TTL_SECONDS'),
    );

    const accessTtlSeconds = Math.min(
      configuredAccessTtlSeconds,
      remainingSessionSeconds,
    );

    const accessPayload = {
      sub: session.user.id,
      tokenType: 'access',
    } satisfies AccessTokenPayload;

    const refreshPayload = {
      sub: session.user.id,
      sid: session.id,
      tokenType: 'refresh',
    } satisfies RefreshTokenPayload;

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        expiresIn: accessTtlSeconds,
        algorithm: 'HS256',
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: refreshSecret,
        expiresIn: remainingSessionSeconds,
        algorithm: 'HS256',
      }),
    ]);

    const currentRefreshTokenHash = this.hashToken(refreshToken);
    const newRefreshTokenHash = this.hashToken(newRefreshToken);

    const rotationResult = await this.authSessionsService.rotateRefreshToken({
      id: session.id,
      currentRefreshTokenHash,
      newRefreshTokenHash,
      now: new Date(),
    });

    if (rotationResult.count !== 1) {
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    return {
      user: {
        id: session.user.id,
        fullName: session.user.fullName,
        username: session.user.username,
        role: session.user.role,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTtlSeconds,
      refreshTtlSeconds: remainingSessionSeconds,
    };
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
