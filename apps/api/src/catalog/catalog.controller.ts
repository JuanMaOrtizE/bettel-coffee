import { Controller, Get } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/client.js';
import { CatalogService } from './catalog.service.js';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get()
  @Roles(Role.OWNER, Role.ADMIN, Role.WAITER, Role.BARISTA)
  findOperationalCatalog() {
    return this.catalogService.findOperationalCatalog();
  }
}
