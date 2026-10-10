import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from '../generated/prisma/client.js';
import type { AuthenticatedUser } from '../auth/authenticated-user.type.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

import {
  createUserSchema,
  type CreateUserInput,
} from './schemas/create-user.schema.js';
import { UsersService } from './users.service.js';
import {
  updateUserSchema,
  type UpdateUserInput,
} from './schemas/update-user.schema.js';
import {
  resetUserPasswordSchema,
  type ResetUserPasswordInput,
} from './schemas/reset-user-password.schema.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN)
  findAll(
    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.usersService.findAllVisibleTo(
      currentUser.businessId,
      currentUser.role,
    );
  }

  @Patch(':id')
  @Roles(Role.OWNER, Role.ADMIN)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    targetUserId: string,

    @Body({ schema: updateUserSchema })
    input: UpdateUserInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.usersService.update(
      targetUserId,
      input,
      currentUser.businessId,
      currentUser.role,
    );
  }

  @Patch(':id/password')
  @Roles(Role.OWNER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    targetUserId: string,

    @Body({ schema: resetUserPasswordSchema })
    input: ResetUserPasswordInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ): Promise<void> {
    await this.usersService.resetPassword(
      targetUserId,
      input,
      currentUser.businessId,
      currentUser.role,
    );
  }

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createUserSchema })
    input: CreateUserInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.usersService.create(
      input,
      currentUser.role,
      currentUser.businessId,
    );
  }

  @Patch(':id/deactivate')
  @Roles(Role.OWNER, Role.ADMIN)
  deactivate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    targetUserId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.usersService.deactivate(
      targetUserId,
      currentUser.businessId,
      currentUser.id,
      currentUser.role,
    );
  }

  @Patch(':id/activate')
  @Roles(Role.OWNER, Role.ADMIN)
  activate(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    targetUserId: string,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.usersService.activate(
      targetUserId,
      currentUser.businessId,
      currentUser.role,
    );
  }
}
