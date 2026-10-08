import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CategoriesController } from './categories.controller.js';
import { CategoriesService } from './categories.service.js';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';
import { CatalogService } from './catalog.service.js';
import { CatalogController } from './catalog.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [CategoriesController, ProductsController, CatalogController],
  providers: [CategoriesService, ProductsService, CatalogService],
})
export class CatalogModule {}
