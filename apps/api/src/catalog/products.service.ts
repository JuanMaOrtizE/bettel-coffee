import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { normalizeCatalogName } from './catalog-name.normalizer.js';
import type { CreateProductInput } from './schemas/create-product.schema.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateProductInput) {
    const normalizedName = normalizeCatalogName(input.name);
    const price = new Prisma.Decimal(input.price);

    try {
      return await this.prisma.product.create({
        data: {
          categoryId: input.categoryId,
          name: input.name,
          normalizedName,
          price,
        },
        select: {
          id: true,
          categoryId: true,
          name: true,
          price: true,
          isActive: true,
          isAvailable: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Ya existe un producto con ese nombre');
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new NotFoundException('Categoría no encontrada');
      }

      throw error;
    }
  }
}
