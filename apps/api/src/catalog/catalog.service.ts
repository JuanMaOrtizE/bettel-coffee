import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  findOperationalCatalog(businessId: string) {
    return this.prisma.category.findMany({
      where: {
        businessId,
        isActive: true,
        products: {
          some: {
            businessId,
            isActive: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
        products: {
          where: {
            businessId,
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
