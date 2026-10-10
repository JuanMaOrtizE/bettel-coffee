import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { normalizeCatalogName } from './catalog-name.normalizer.js';
import type { CreateProductInput } from './schemas/create-product.schema.js';
import type { UpdateProductInput } from './schemas/update-product.schema.js';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(businessId: string) {
    return this.prisma.product.findMany({
      where: {
        businessId,
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
        category: {
          select: {
            id: true,
            name: true,
            isActive: true,
          },
        },
      },
      orderBy: [
        {
          category: {
            name: 'asc',
          },
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  activate(productId: string, businessId: string) {
    return this.setStatus(productId, businessId, {
      isActive: true,
    });
  }

  deactivate(productId: string, businessId: string) {
    return this.setStatus(productId, businessId, {
      isActive: false,
    });
  }

  markAvailable(productId: string, businessId: string) {
    return this.setStatus(productId, businessId, {
      isAvailable: true,
    });
  }

  markUnavailable(productId: string, businessId: string) {
    return this.setStatus(productId, businessId, {
      isAvailable: false,
    });
  }

  async update(
    productId: string,
    input: UpdateProductInput,
    businessId: string,
  ) {
    try {
      return await this.prisma.product.update({
        where: {
          id: productId,
          businessId,
        },
        data: {
          ...(input.categoryId !== undefined
            ? { categoryId: input.categoryId }
            : {}),

          ...(input.name !== undefined
            ? {
                name: input.name,
                normalizedName: normalizeCatalogName(input.name),
              }
            : {}),

          ...(input.price !== undefined
            ? { price: new Prisma.Decimal(input.price) }
            : {}),
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

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Producto no encontrado');
      }

      throw error;
    }
  }

  async create(input: CreateProductInput, businessId: string) {
    const normalizedName = normalizeCatalogName(input.name);
    const price = new Prisma.Decimal(input.price);

    try {
      return await this.prisma.product.create({
        data: {
          businessId,
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

  private async setStatus(
    productId: string,
    businessId: string,
    data: {
      isActive?: boolean;
      isAvailable?: boolean;
    },
  ) {
    try {
      return await this.prisma.product.update({
        where: {
          id: productId,
          businessId,
        },
        data,
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
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Producto no encontrado');
      }

      throw error;
    }
  }
}
