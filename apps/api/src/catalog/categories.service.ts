import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateCategoryInput } from './schemas/create-category.schema.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCategoryInput) {
    const normalizedName = input.name.normalize('NFKC').toLocaleLowerCase('es');

    try {
      return await this.prisma.category.create({
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

      throw error;
    }
  }
}
