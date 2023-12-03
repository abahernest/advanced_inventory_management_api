import { Controller, Body, Patch, Param } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/inventory.dto';
import { InventoryIdDto } from './dto/inventory.dto';
import { ErrorLogger } from '../utils/error';
import { DataSource } from 'typeorm';
import { ProductService } from '../product/product.service';

@Controller('inventory')
export class InventoryController {
  logger: ErrorLogger;
  constructor(
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
    private readonly inventoryService: InventoryService,
  ) {
    this.logger = new ErrorLogger('InventoryController');
  }

  @Patch(':inventory_id')
  async update(
    @Param() inventoryIdDto: InventoryIdDto,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ): Promise<UpdateInventoryDto> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const queryRunner = manager.queryRunner;

        await this.inventoryService.updateOne(
          inventoryIdDto.inventory_id,
          updateInventoryDto,
          queryRunner,
        );

        // modify product quantity
        if (updateInventoryDto.physical_quantity) {
          const inventory = await this.inventoryService.findById(
            inventoryIdDto.inventory_id,
            queryRunner,
          );

          await this.productService.updateOne(
            inventory.product_id,
            { quantity: updateInventoryDto.physical_quantity },
            queryRunner,
          );
        }
      });

      return updateInventoryDto;
    } catch (e) {
      this.logger.handleError(`an error occurred while updating inventory`, e);
    }
  }
}
