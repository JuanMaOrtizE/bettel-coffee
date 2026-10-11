import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PlatformAdminsService } from './platform-admins.service.js';
import { PlatformAuthSessionsService } from './platform-auth-sessions.service.js';

@Module({
  imports: [PrismaModule],
  providers: [PlatformAdminsService, PlatformAuthSessionsService],
})
export class PlatformModule {}
