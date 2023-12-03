import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryEntity } from './entities/inventory.entity';
import { InventoryIdExistsConstraint } from './validators/inventory-id-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryEntity])],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryIdExistsConstraint],
  exports: [InventoryService, InventoryIdExistsConstraint],
})
export class InventoryModule {}
