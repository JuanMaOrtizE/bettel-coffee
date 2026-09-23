import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthSessionService } from './auth-sessions.service.js';

@Module({
  imports: [
    PrismaService,
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
  providers: [AuthService, AuthSessionService],
})
export class AuthModule {}
