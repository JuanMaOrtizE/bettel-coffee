import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PlatformAccessTokenGuard } from './guards/platform-access-token.guard.js';
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
    PlatformAccessTokenGuard,
    {
      provide: APP_GUARD,
      useExisting: PlatformAccessTokenGuard,
    },
  ],
})
export class PlatformModule {}
