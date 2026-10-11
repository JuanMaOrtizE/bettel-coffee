import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

type CreatePlatformAuthSessionInput = {
  id: string;
  platformAdminId: string;
  refreshTokenHash: string;
  expiresAt: Date;
};

type RotatePlatformRefreshTokenInput = {
  id: string;
  currentRefreshTokenHash: string;
  newRefreshTokenHash: string;
  now: Date;
};

type RevokePlatformAuthSessionInput = {
  id: string;
  platformAdminId: string;
  refreshTokenHash: string;
  revokedAt: Date;
};

@Injectable()
export class PlatformAuthSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreatePlatformAuthSessionInput) {
    return this.prisma.platformAuthSession.create({
      data: input,
      select: {
        id: true,
        platformAdminId: true,
        expiresAt: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.platformAuthSession.findUnique({
      where: { id },
      select: {
        id: true,
        platformAdminId: true,
        refreshTokenHash: true,
        expiresAt: true,
        revokedAt: true,
        platformAdmin: {
          select: {
            id: true,
            fullName: true,
            username: true,
            isActive: true,
          },
        },
      },
    });
  }

  rotateRefreshToken(input: RotatePlatformRefreshTokenInput) {
    return this.prisma.platformAuthSession.updateMany({
      where: {
        id: input.id,
        refreshTokenHash: input.currentRefreshTokenHash,
        revokedAt: null,
        expiresAt: {
          gt: input.now,
        },
      },
      data: {
        refreshTokenHash: input.newRefreshTokenHash,
      },
    });
  }

  revoke(input: RevokePlatformAuthSessionInput) {
    return this.prisma.platformAuthSession.updateMany({
      where: {
        id: input.id,
        platformAdminId: input.platformAdminId,
        refreshTokenHash: input.refreshTokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: input.revokedAt,
      },
    });
  }
}
