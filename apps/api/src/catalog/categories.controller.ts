import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/client.js';
import {
  createCategorySchema,
  type CreateCategoryInput,
} from './schemas/create-category.schema.js';
import { CategoriesService } from './categories.service.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createCategorySchema })
    input: CreateCategoryInput,
  ) {
    return this.categoriesService.create(input);
  }
}
