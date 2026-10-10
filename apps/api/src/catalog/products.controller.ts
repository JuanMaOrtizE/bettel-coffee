import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/authenticated-user.type.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
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
  findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.productsService.findAll(currentUser.businessId);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,

    @Body({ schema: updateProductSchema })
    input: UpdateProductInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.productsService.update(
      productId,
      input,
      currentUser.businessId,
    );
  }

  @Patch(':id/deactivate')
  @Roles(Role.OWNER, Role.ADMIN)
  deactivate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.productsService.deactivate(
      productId,
      currentUser.businessId,
    );
  }

  @Patch(':id/activate')
  @Roles(Role.OWNER, Role.ADMIN)
  activate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.productsService.activate(productId, currentUser.businessId);
  }

  @Patch(':id/unavailable')
  @Roles(Role.OWNER, Role.ADMIN, Role.BARISTA)
  markUnavailable(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.productsService.markUnavailable(
      productId,
      currentUser.businessId,
    );
  }

  @Patch(':id/available')
  @Roles(Role.OWNER, Role.ADMIN, Role.BARISTA)
  markAvailable(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    productId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.productsService.markAvailable(
      productId,
      currentUser.businessId,
    );
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createProductSchema })
    input: CreateProductInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.productsService.create(input, currentUser.businessId);
  }
}
