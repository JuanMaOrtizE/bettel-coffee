import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PlatformAdminsService } from './platform-admins.service.js';
import { PlatformAuthController } from './platform-auth.controller.js';
import { PlatformAuthSessionsService } from './platform-auth-sessions.service.js';
import { PlatformAuthService } from './platform-auth.service.js';

@Module({
  imports: [PrismaModule, JwtModule.register({})],
  controllers: [PlatformAuthController],
  providers: [
    PlatformAdminsService,
    PlatformAuthSessionsService,
    PlatformAuthService,
  ],
})
export class PlatformModule {}
