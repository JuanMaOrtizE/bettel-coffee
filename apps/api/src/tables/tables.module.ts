import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { TablesService } from './tables.service.js';
import { TablesController } from './tables.controller.js';

@Module({
  imports: [PrismaModule],
  providers: [TablesService],
  controllers: [TablesController],
})
export class TablesModule {}
