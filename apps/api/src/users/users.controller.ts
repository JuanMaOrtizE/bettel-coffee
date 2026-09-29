import { Body, Controller, Post } from '@nestjs/common';
import { Role } from '../generated/prisma/client.js';
import type { AuthenticatedUser } from '../auth/authenticated-user.type.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import {
  createUserSchema,
  type CreateUserInput,
} from './schemas/create-user.schema.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.OWNER, Role.ADMIN)
  create(
    @Body({ schema: createUserSchema })
    input: CreateUserInput,

    @CurrentUser()
    currentUser: AuthenticatedUser,
  ) {
    return this.usersService.create(input, currentUser.role);
  }
}
