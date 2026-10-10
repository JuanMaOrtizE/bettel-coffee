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
import {
  createCategorySchema,
  type CreateCategoryInput,
} from './schemas/create-category.schema.js';
import { CategoriesService } from './categories.service.js';
import {
  updateCategorySchema,
  type UpdateCategoryInput,
} from './schemas/update-category.schema.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN)
  findAll(@CurrentUser() currentUser: AuthenticatedUser) {
    return this.categoriesService.findAll(currentUser.businessId);
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,

    @Body({ schema: updateCategorySchema })
    input: UpdateCategoryInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.categoriesService.update(
      categoryId,
      input,
      currentUser.businessId,
    );
  }

  @Patch(':id/deactivate')
  @Roles(Role.OWNER, Role.ADMIN)
  deactivate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.categoriesService.deactivate(
      categoryId,
      currentUser.businessId,
    );
  }

  @Patch(':id/activate')
  @Roles(Role.OWNER, Role.ADMIN)
  activate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.categoriesService.activate(categoryId, currentUser.businessId);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createCategorySchema })
    input: CreateCategoryInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.categoriesService.create(input, currentUser.businessId);
  }
}
