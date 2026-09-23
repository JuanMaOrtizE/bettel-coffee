import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

type CreateAuthSessionInput = {
  id: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
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
}
