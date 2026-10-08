import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  findOperationalCatalog() {
    return this.prisma.category.findMany({
      where: {
        isActive: true,
        products: {
          some: {
            isActive: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        products: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            price: true,
            isAvailable: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
