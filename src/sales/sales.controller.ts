import { Controller, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesDto } from './dto/sales.dto';
import { DataSource, EntityManager } from 'typeorm';
import { InventoryService } from '../inventory/inventory.service';
import { ProductService } from '../product/product.service';
import { ErrorLogger } from '../utils/error';
import { UpdateSingleProductDto } from '../product/dto/create-product.dto';
import { UpdateInventoryDto } from '../inventory/dto/inventory.dto';

@Controller('sales')
export class SalesController {
  logger: ErrorLogger;
  constructor(
    private readonly dataSource: DataSource,
    private readonly inventoryService: InventoryService,
    private readonly productService: ProductService,
    private readonly salesService: SalesService,
  ) {
    this.logger = new ErrorLogger('SalesController');
  }

  @Post('purchase')
  async create(@Body() createSaleDto: CreateSalesDto) {
    try {
      // allow typeOrm handle transactions for network retries
      await this.dataSource.transaction(async (manager: EntityManager) => {
        const queryRunner = manager.queryRunner;

        const productArray = await this.productService.findByIds(
          createSaleDto.sales_data.map((item) => item.product_id),
          queryRunner,
        );

        // check that product is in stock
        const productDtoArray: Partial<UpdateSingleProductDto>[] = [],
          inventoryDtoArray: Partial<UpdateInventoryDto>[] = [];
        for (let i = 0; i < productArray.length; i += 1) {
          const product = productArray[i];
          const purchaseData = createSaleDto.sales_data[i];

          // insufficient quantity
          if (product.quantity < purchaseData.quantity_sold) {
            break;
          }

          productDtoArray.push({
            id: product.id,
            quantity: product.quantity - purchaseData.quantity_sold,
          });
          inventoryDtoArray.push({
            product_id: product.id,
            physical_quantity: product.quantity - purchaseData.quantity_sold,
          });
        }

        // throw error if quantity insufficient to satisfy order
        if (productDtoArray.length !== createSaleDto.sales_data.length) {
          throw new Error(
            `400:-Bad Request:-Order quantity for product at index ${
              productDtoArray.length - 1
            } exceeds available amount`,
          );
        }

        // create sales data
        const salesResults = await this.salesService.bulkCreate(
          createSaleDto.sales_data,
          queryRunner,
        );
        if (salesResults.length !== createSaleDto.sales_data.length) {
          throw new Error(
            `500:-Internal Server Error:-could not bulk insert sales data during product purchase. ${JSON.stringify(
              createSaleDto.sales_data,
            )}`,
          );
        }

        // updating product quantity in 2 tables, I recon would be better than having to JOIN
        // the product table with the inventory table when fetching product list
        // which has higher usage and requires more computing

        // modify product quantity
        const productUpsertResults = await this.productService.bulkUpsert(
          productDtoArray,
          queryRunner,
        );
        if (productUpsertResults.length !== productArray.length) {
          throw new Error(
            `500:-Internal Server Error:-could not modify product quantity after purchase. ${JSON.stringify(
              productDtoArray,
            )}`,
          );
        }

        // modify inventory physical quantity
        const inventoryUpsertResults = await this.inventoryService.bulkUpsert(
          inventoryDtoArray,
          queryRunner,
        );
        if (inventoryUpsertResults.length !== inventoryDtoArray.length) {
          throw new Error(
            `500:-Internal Server Error:-could not modify inventory physical quantity after purchase. ${JSON.stringify(
              inventoryDtoArray,
            )}`,
          );
        }
      });

      return createSaleDto;
    } catch (e) {
      this.logger.handleError(`an error occurred while making a purchase`, e);
    }
  }
}
