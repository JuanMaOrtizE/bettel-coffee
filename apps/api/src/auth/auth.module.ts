import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UsersModule } from '../users/users.module.js';
import { AuthSessionsService } from './auth-sessions.service.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: Number(configService.getOrThrow('JWT_ACCESS_TTL_SECONDS')),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthSessionsService],
})
export class AuthModule {}
