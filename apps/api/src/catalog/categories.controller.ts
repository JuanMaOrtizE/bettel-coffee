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
  findAll() {
    return this.categoriesService.findAll();
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,

    @Body({ schema: updateCategorySchema })
    input: UpdateCategoryInput,
  ) {
    return this.categoriesService.update(categoryId, input);
  }

  @Patch(':id/deactivate')
  @Roles(Role.OWNER, Role.ADMIN)
  deactivate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,
  ) {
    return this.categoriesService.deactivate(categoryId);
  }

  @Patch(':id/activate')
  @Roles(Role.OWNER, Role.ADMIN)
  activate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,
  ) {
    return this.categoriesService.activate(categoryId);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createCategorySchema })
    input: CreateCategoryInput,
  ) {
    return this.categoriesService.create(input);
  }
}
