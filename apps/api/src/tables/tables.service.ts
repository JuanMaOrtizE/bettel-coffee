import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Prisma,
  Role,
  TableStatus,
} from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateTableInput } from './schemas/create-table.schema.js';
import type { UpdateTableInput } from './schemas/update-table.schema.js';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  findAllVisibleTo(actorRole: Role) {
    if (
      actorRole !== Role.OWNER &&
      actorRole !== Role.ADMIN &&
      actorRole !== Role.WAITER
    ) {
      throw new ForbiddenException(
        'No tienes permisos para consultar mesas',
      );
    }

    const where =
      actorRole === Role.WAITER
        ? {
            isActive: true,
          }
        : undefined;

    return this.prisma.cafeTable.findMany({
      where,
      select: {
        id: true,
        label: true,
        status: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        label: 'asc',
      },
    });
  }

  async update(tableId: string, input: UpdateTableInput) {
    const normalizedLabel = this.normalizeLabel(input.label);

    try {
      return await this.prisma.cafeTable.update({
        where: {
          id: tableId,
        },
        data: {
          label: input.label,
          normalizedLabel,
        },
        select: {
          id: true,
          label: true,
          status: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya existe una mesa con ese identificador',
        );
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Mesa no encontrada');
      }

      throw error;
    }
  }

  async deactivate(tableId: string) {
    try {
      return await this.prisma.cafeTable.update({
        where: {
          id: tableId,
          status: TableStatus.AVAILABLE,
        },
        data: {
          isActive: false,
        },
        select: {
          id: true,
          label: true,
          status: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        const table = await this.prisma.cafeTable.findUnique({
          where: {
            id: tableId,
          },
          select: {
            id: true,
          },
        });

        if (!table) {
          throw new NotFoundException('Mesa no encontrada');
        }

        throw new ConflictException(
          'Solo se puede desactivar una mesa disponible',
        );
      }

      throw error;
    }
  }

  async activate(tableId: string) {
    try {
      return await this.prisma.cafeTable.update({
        where: {
          id: tableId,
        },
        data: {
          isActive: true,
        },
        select: {
          id: true,
          label: true,
          status: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Mesa no encontrada');
      }

      throw error;
    }
  }

  async create(input: CreateTableInput) {
    const normalizedLabel = this.normalizeLabel(input.label);

    try {
      return await this.prisma.cafeTable.create({
        data: {
          label: input.label,
          normalizedLabel,
        },
        select: {
          id: true,
          label: true,
          status: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Ya existe una mesa con ese identificador',
        );
      }

      throw error;
    }
  }

  private normalizeLabel(label: string) {
    return label.normalize('NFKC').toLocaleLowerCase('es');
  }
}
