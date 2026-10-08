import { Body, Controller, Get, Post } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/client.js';
import {
  createTableSchema,
  type CreateTableInput,
} from './schemas/create-table.schema.js';
import { TablesService } from './tables.service.js';
import type { AuthenticatedUser } from '../auth/authenticated-user.type.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.WAITER)
  findAll(
    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.tablesService.findAllVisibleTo(currentUser.role);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createTableSchema })
    input: CreateTableInput,
  ) {
    return this.tablesService.create(input);
  }
}
