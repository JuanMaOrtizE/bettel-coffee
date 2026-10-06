import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/client.js';
import { ProductsService } from './products.service.js';
import {
  createProductSchema,
  type CreateProductInput,
} from './schemas/create-product.schema.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createProductSchema })
    input: CreateProductInput,
  ) {
    return this.productsService.create(input);
  }
}
