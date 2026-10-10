import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { normalizeCatalogName } from './catalog-name.normalizer.js';
import type { CreateCategoryInput } from './schemas/create-category.schema.js';
import type { UpdateCategoryInput } from './schemas/update-category.schema.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(businessId: string) {
    return this.prisma.category.findMany({
      where: {
        businessId,
      },
      select: {
        id: true,
        name: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  activate(categoryId: string, businessId: string) {
    return this.setActiveStatus(categoryId, businessId, true);
  }

  deactivate(categoryId: string, businessId: string) {
    return this.setActiveStatus(categoryId, businessId, false);
  }

  async update(
    categoryId: string,
    input: UpdateCategoryInput,
    businessId: string,
  ) {
    const normalizedName = normalizeCatalogName(input.name);

    try {
      return await this.prisma.category.update({
        where: {
          id: categoryId,
          businessId,
        },
        data: {
          name: input.name,
          normalizedName,
        },
        select: {
          id: true,
          name: true,
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
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Categoría no encontrada');
      }

      throw error;
    }
  }

  async create(input: CreateCategoryInput, businessId: string) {
    const normalizedName = normalizeCatalogName(input.name);

    try {
      return await this.prisma.category.create({
        data: {
          name: input.name,
          normalizedName,
          business: {
            connect: {
              id: businessId,
            },
          },
        },
        select: {
          id: true,
          name: true,
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
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }

      throw error;
    }
  }

  private async setActiveStatus(
    categoryId: string,
    businessId: string,
    isActive: boolean,
  ) {
    try {
      return await this.prisma.category.update({
        where: {
          id: categoryId,
          businessId,
        },
        data: {
          isActive,
        },
        select: {
          id: true,
          name: true,
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
        throw new NotFoundException('Categoría no encontrada');
      }

      throw error;
    }
  }

}
