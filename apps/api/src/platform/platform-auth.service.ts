import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { PlatformAdminsService } from './platform-admins.service.js';

type PlatformLoginCredentials = {
  username: string;
  password: string;
};

@Injectable()
export class PlatformAuthService {
  constructor(
    private readonly platformAdminsService: PlatformAdminsService,
  ) {}

  async validateCredentials(credentials: PlatformLoginCredentials) {
    const platformAdmin =
      await this.platformAdminsService.findByUsername(credentials.username);

    if (!platformAdmin || !platformAdmin.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordIsValid = await argon2.verify(
      platformAdmin.passwordHash,
      credentials.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      id: platformAdmin.id,
      fullName: platformAdmin.fullName,
      username: platformAdmin.username,
    };
  }
}
