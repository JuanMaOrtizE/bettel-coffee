import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma, Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateTableInput } from './schemas/create-table.schema.js';

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
