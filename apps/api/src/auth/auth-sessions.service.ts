import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

type CreateAuthSessionInput = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
};

type RotateRefreshTokenInput = {
  id: string;
  currentRefreshTokenHash: string;
  newRefreshTokenHash: string;
  now: Date;
};

type RevokeAuthSessionInput = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  revokedAt: Date;
};

@Injectable()
export class AuthSessionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: CreateAuthSessionInput) {
    return this.prisma.authSession.create({
      data: input,
      select: {
        id: true,
        userId: true,
        expiresAt: true,
      },
    });
  }

  findById(id: string) {
    return this.prisma.authSession.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        refreshTokenHash: true,
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            id: true,
            fullName: true,
            username: true,
            role: true,
            isActive: true,
          },
        },
      },
    });
  }

  rotateRefreshToken(input: RotateRefreshTokenInput) {
    return this.prisma.authSession.updateMany({
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

  revoke(input: RevokeAuthSessionInput) {
    return this.prisma.authSession.updateMany({
      where: {
        id: input.id,
        userId: input.userId,
        refreshTokenHash: input.refreshTokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: input.revokedAt,
      },
    });
  }
}
