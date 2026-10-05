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
import type { UpdateUserInput } from './schemas/update-user.schema.js';

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

  async activate(targetUserId: string, actorRole: Role) {
    const targetUser = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
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

    this.assertCanManageRole(actorRole, targetUser.role);

    if (targetUser.isActive) {
      return targetUser;
    }

    return this.prisma.user.update({
      where: {
        id: targetUserId,
      },
      data: {
        isActive: true,
        deactivatedAt: null,
      },
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

      this.assertCanManageRole(actorRole, targetUser.role);

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

  async update(targetUserId: string, input: UpdateUserInput, actorRole: Role) {
    const targetUser = await this.prisma.user.findUnique({
      where: {
        id: targetUserId,
      },
      select: {
        role: true,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    this.assertCanManageRole(actorRole, targetUser.role);

    if (input.role !== undefined) {
      this.assertCanAssignRole(actorRole, input.role);
    }

    const managedRoles = this.managedRolesFor(actorRole);

    try {
      return await this.prisma.user.update({
        where: {
          id: targetUserId,
          role: {
            in: managedRoles,
          },
        },
        data: {
          ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),

          ...(input.username !== undefined ? { username: input.username } : {}),

          ...(input.role !== undefined ? { role: input.role } : {}),
        },
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
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new ForbiddenException('El usuario ya no puede ser gestionado');
      }

      throw error;
    }
  }

  async create(input: CreateUserInput, actorRole: Role) {
    this.assertCanAssignRole(actorRole, input.role);

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

  private managedRolesFor(actorRole: Role): Role[] {
    if (actorRole === Role.OWNER) {
      return [Role.ADMIN, Role.WAITER, Role.BARISTA];
    }

    if (actorRole === Role.ADMIN) {
      return [Role.WAITER, Role.BARISTA];
    }

    return [];
  }

  private assertCanManageRole(actorRole: Role, targetRole: Role) {
    const managedRoles = this.managedRolesFor(actorRole);

    if (!managedRoles.includes(targetRole)) {
      throw new ForbiddenException('No puedes gestionar este usuario');
    }
  }

  private assertCanAssignRole(actorRole: Role, requestedRole: Role) {
    const assignableRoles = this.managedRolesFor(actorRole);

    if (!assignableRoles.includes(requestedRole)) {
      throw new ForbiddenException('No puedes asignar este rol');
    }
  }
}
