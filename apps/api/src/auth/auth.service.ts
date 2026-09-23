import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service.js';
import type { LoginInput } from './schemas/login.schema.js';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async validateCredentials(credentials: LoginInput) {
    const user = await this.userService.findByUsername(credentials.username);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordIsValid = await argon2.verify(
      user.passwordHash,
      credentials.password,
    );
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
    };
  }
}
