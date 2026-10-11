import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PlatformAdminsService {
  constructor(private readonly prisma: PrismaService) {}

  findByUsername(username: string) {
    return this.prisma.platformAdmin.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        passwordHash: true,
        isActive: true,
      },
    });
  }
}
