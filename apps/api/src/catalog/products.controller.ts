import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/client.js';
import { ProductsService } from './products.service.js';
import {
  createProductSchema,
  type CreateProductInput,
} from './schemas/create-product.schema.js';

import {
  updateProductSchema,
  type UpdateProductInput,
} from './schemas/update-product.schema.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN)
  findAll() {
    return this.productsService.findAll();
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,

    @Body({ schema: updateProductSchema })
    input: UpdateProductInput,
  ) {
    return this.productsService.update(productId, input);
  }

  @Patch(':id/deactivate')
  @Roles(Role.OWNER, Role.ADMIN)
  deactivate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,
  ) {
    return this.productsService.deactivate(productId);
  }

  @Patch(':id/activate')
  @Roles(Role.OWNER, Role.ADMIN)
  activate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,
  ) {
    return this.productsService.activate(productId);
  }

  @Patch(':id/unavailable')
  @Roles(Role.OWNER, Role.ADMIN, Role.BARISTA)
  markUnavailable(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,
  ) {
    return this.productsService.markUnavailable(productId);
  }

  @Patch(':id/available')
  @Roles(Role.OWNER, Role.ADMIN, Role.BARISTA)
  markAvailable(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,
  ) {
    return this.productsService.markAvailable(productId);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createProductSchema })
    input: CreateProductInput,
  ) {
    return this.productsService.create(input);
  }
}
