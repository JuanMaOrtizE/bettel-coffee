import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
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

  findAllVisibleTo(actorRole: Role) {
    if (actorRole !== Role.OWNER && actorRole !== Role.ADMIN) {
      throw new ForbiddenException(
        'No tienes permisos para consultar usuarios',
      );
    }

    const where =
      actorRole === Role.ADMIN
        ? {
            role: {
              in: [Role.WAITER, Role.BARISTA],
            },
          }
        : undefined;

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        username: true,
        role: true,
        isActive: true,
        deactivatedAt: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        fullName: 'asc',
      },
    });
  }

  async deactivate(targetUserId: string, actorId: string, actorRole: Role) {
    if (targetUserId === actorId) {
      throw new ForbiddenException('No puedes desactivar tu propia cuenta');
    }

    return this.prisma.$transaction(async (transaction) => {
      const targetUser = await transaction.user.findUnique({
        where: { id: targetUserId },
        select: {
          id: true,
          fullName: true,
          username: true,
          role: true,
          isActive: true,
          deactivatedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!targetUser) {
        throw new NotFoundException('Usuario no encontrado');
      }

      this.assertCanDeactivateRole(actorRole, targetUser.role);

      const now = new Date();

      const deactivatedUser = targetUser.isActive
        ? await transaction.user.update({
            where: {
              id: targetUserId,
            },
            data: { isActive: false, deactivatedAt: now },
            select: {
              id: true,
              fullName: true,
              username: true,
              role: true,
              isActive: true,
              deactivatedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          })
        : targetUser;

      await transaction.authSession.updateMany({
        where: {
          userId: targetUserId,
          revokedAt: null,
        },
        data: {
          revokedAt: now,
        },
      });
      return deactivatedUser;
    });
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

  private assertCanDeactivateRole(actorRole: Role, targetRole: Role) {
    const rolesManagedByOwner: Role[] = [Role.ADMIN, Role.WAITER, Role.BARISTA];

    const rolesManagedByAdmin: Role[] = [Role.WAITER, Role.BARISTA];

    const ownerCanDeactivate =
      actorRole === Role.OWNER && rolesManagedByOwner.includes(targetRole);

    const adminCanDeactivate =
      actorRole === Role.ADMIN && rolesManagedByAdmin.includes(targetRole);

    if (!ownerCanDeactivate && !adminCanDeactivate) {
      throw new ForbiddenException('No puedes desactivar este usuario');
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
