import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Prisma, Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateUserInput } from './schemas/create-user.schema.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByUsername(username: string) {
    return this.prisma.user.findUnique({ where: { username } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async create(input: CreateUserInput, actorRole: Role) {
    this.assertCanCreateRole(actorRole, input.role);

    const passwordHash = await argon2.hash(input.password, {
      type: argon2.argon2id,
    });

    try {
      return await this.prisma.user.create({
        data: {
          fullName: input.fullName,
          username: input.username,
          passwordHash,
          role: input.role,
        },
        select: {
          id: true,
          fullName: true,
          username: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }

      throw error;
    }
  }

  private assertCanCreateRole(
    actorRole: Role,
    requestedRole: CreateUserInput['role'],
  ) {
    const ownerCanCreateRole = actorRole === Role.OWNER;

    const adminCanCreateRole =
      actorRole === Role.ADMIN &&
      (requestedRole === Role.WAITER || requestedRole === Role.BARISTA);

    if (!ownerCanCreateRole && !adminCanCreateRole) {
      throw new ForbiddenException('No puedes crear usuarios con ese rol');
    }
  }
}
