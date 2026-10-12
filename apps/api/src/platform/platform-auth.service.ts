import { createHash, randomUUID } from 'node:crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PlatformAdminsService } from './platform-admins.service.js';
import { PlatformAuthSessionsService } from './platform-auth-sessions.service.js';
import {
  platformRefreshTokenClaimsSchema,
  type PlatformAccessTokenPayload,
  type PlatformRefreshTokenPayload,
} from './platform-auth-token.schemas.js';
import type { PlatformLoginInput } from './schemas/platform-login.schema.js';

@Injectable()
export class PlatformAuthService {
  constructor(
    private readonly platformAdminsService: PlatformAdminsService,
    private readonly platformAuthSessionsService: PlatformAuthSessionsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateCredentials(credentials: PlatformLoginInput) {
    const platformAdmin =
      await this.platformAdminsService.findByUsername(credentials.username);

    if (!platformAdmin || !platformAdmin.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordIsValid = await argon2.verify(
      platformAdmin.passwordHash,
      credentials.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      id: platformAdmin.id,
      fullName: platformAdmin.fullName,
      username: platformAdmin.username,
    };
  }

  async login(credentials: PlatformLoginInput) {
    const platformAdmin = await this.validateCredentials(credentials);
    const sessionId = randomUUID();

    const accessTtlSeconds = Number(
      this.configService.getOrThrow('JWT_ACCESS_TTL_SECONDS'),
    );
    const refreshTtlSeconds = Number(
      this.configService.getOrThrow('JWT_REFRESH_TTL_SECONDS'),
    );

    const accessPayload = {
      sub: platformAdmin.id,
      sid: sessionId,
      actorType: 'platform_admin',
      tokenType: 'access',
    } satisfies PlatformAccessTokenPayload;

    const refreshPayload = {
      sub: platformAdmin.id,
      sid: sessionId,
      jti: randomUUID(),
      actorType: 'platform_admin',
      tokenType: 'refresh',
    } satisfies PlatformRefreshTokenPayload;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.getOrThrow<string>(
          'PLATFORM_JWT_ACCESS_SECRET',
        ),
        expiresIn: accessTtlSeconds,
        algorithm: 'HS256',
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>(
          'PLATFORM_JWT_REFRESH_SECRET',
        ),
        expiresIn: refreshTtlSeconds,
        algorithm: 'HS256',
      }),
    ]);

    const refreshTokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + refreshTtlSeconds * 1000);

    await this.platformAuthSessionsService.create({
      id: sessionId,
      platformAdminId: platformAdmin.id,
      refreshTokenHash,
      expiresAt,
    });

    return {
      platformAdmin,
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    const claims = await this.verifyRefreshToken(refreshToken);
    const session = await this.platformAuthSessionsService.findById(claims.sid);
    const now = new Date();

    if (
      !session ||
      session.platformAdminId !== claims.sub ||
      session.revokedAt ||
      session.expiresAt <= now ||
      !session.platformAdmin.isActive
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
      sub: session.platformAdmin.id,
      sid: session.id,
      actorType: 'platform_admin',
      tokenType: 'access',
    } satisfies PlatformAccessTokenPayload;

    const refreshPayload = {
      sub: session.platformAdmin.id,
      sid: session.id,
      jti: randomUUID(),
      actorType: 'platform_admin',
      tokenType: 'refresh',
    } satisfies PlatformRefreshTokenPayload;

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.jwtService.signAsync(accessPayload, {
        secret: this.configService.getOrThrow<string>(
          'PLATFORM_JWT_ACCESS_SECRET',
        ),
        expiresIn: accessTtlSeconds,
        algorithm: 'HS256',
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.getOrThrow<string>(
          'PLATFORM_JWT_REFRESH_SECRET',
        ),
        expiresIn: remainingSessionSeconds,
        algorithm: 'HS256',
      }),
    ]);

    const currentRefreshTokenHash = this.hashToken(refreshToken);
    const newRefreshTokenHash = this.hashToken(newRefreshToken);

    const rotationResult =
      await this.platformAuthSessionsService.rotateRefreshToken({
        id: session.id,
        currentRefreshTokenHash,
        newRefreshTokenHash,
        now: new Date(),
      });

    if (rotationResult.count !== 1) {
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    return {
      platformAdmin: {
        id: session.platformAdmin.id,
        fullName: session.platformAdmin.fullName,
        username: session.platformAdmin.username,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTtlSeconds,
      refreshTtlSeconds: remainingSessionSeconds,
    };
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) {
      return;
    }

    try {
      const claims = await this.verifyRefreshToken(refreshToken);
      const refreshTokenHash = this.hashToken(refreshToken);

      await this.platformAuthSessionsService.revoke({
        id: claims.sid,
        platformAdminId: claims.sub,
        refreshTokenHash,
        revokedAt: new Date(),
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return;
      }

      throw error;
    }
  }

  private async verifyRefreshToken(refreshToken: string) {
    let decodedToken: unknown;

    try {
      decodedToken = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.getOrThrow<string>(
          'PLATFORM_JWT_REFRESH_SECRET',
        ),
        algorithms: ['HS256'],
      });
    } catch {
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    const parsedClaims =
      platformRefreshTokenClaimsSchema.safeParse(decodedToken);

    if (!parsedClaims.success) {
      throw new UnauthorizedException('Sesión inválida o vencida');
    }

    return parsedClaims.data;
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }
}
