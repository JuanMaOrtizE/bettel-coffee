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
  createTableSchema,
  type CreateTableInput,
} from './schemas/create-table.schema.js';
import {
  updateTableSchema,
  type UpdateTableInput,
} from './schemas/update-table.schema.js';
import { TablesService } from './tables.service.js';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.WAITER)
  findAll(
    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.tablesService.findAllVisibleTo(
      currentUser.businessId,
      currentUser.role,
    );
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    tableId: string,

    @Body({ schema: updateTableSchema })
    input: UpdateTableInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.tablesService.update(tableId, input, currentUser.businessId);
  }

  @Patch(':id/deactivate')
  @Roles(Role.OWNER, Role.ADMIN)
  deactivate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    tableId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.tablesService.deactivate(tableId, currentUser.businessId);
  }

  @Patch(':id/activate')
  @Roles(Role.OWNER, Role.ADMIN)
  activate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    tableId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.tablesService.activate(tableId, currentUser.businessId);
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createTableSchema })
    input: CreateTableInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.tablesService.create(input, currentUser.businessId);
  }
}
