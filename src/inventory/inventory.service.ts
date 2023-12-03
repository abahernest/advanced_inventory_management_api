import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import {
  PaginationDto,
  RestockReportResponse,
  UpdateInventoryDto,
} from './dto/inventory.dto';
import { InventoryEntity } from './entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(private readonly dataSource: DataSource) {}

  async create(
    createInventoryDto: UpdateInventoryDto[],
    queryRunner: QueryRunner | null = null,
  ): Promise<InventoryEntity[]> {
    const inventory = await this.dataSource
      .createEntityManager(queryRunner)
      .save(InventoryEntity, createInventoryDto);
    return inventory as InventoryEntity[];
  }

  async findById(
    id: number,
    queryRunner: QueryRunner | null = null,
  ): Promise<InventoryEntity> {
    return this.dataSource
      .createEntityManager(queryRunner)
      .findOne(InventoryEntity, { where: { id } });
  }

  async updateOne(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
    queryRunner: QueryRunner | null = null,
  ): Promise<Pick<InventoryEntity, 'id' | 'created_at' | 'updated_at'>> {
    const inventory = await this.dataSource
      .createEntityManager(queryRunner)
      .update(InventoryEntity, { id }, updateInventoryDto);
    return inventory.generatedMaps[0] as InventoryEntity;
  }

  async bulkUpsert(
    updateInventoryDtoArray: Partial<UpdateInventoryDto>[],
    queryRunner: QueryRunner | null = null,
  ): Promise<Pick<InventoryEntity, 'id' | 'created_at' | 'updated_at'>[]> {
    const inventories = await this.dataSource
      .createEntityManager(queryRunner)
      .upsert(InventoryEntity, updateInventoryDtoArray, {
        conflictPaths: { product_id: true },
      });
    return inventories.generatedMaps as InventoryEntity[];
  }

  async generateRestockReport(
    { limit, page_number }: PaginationDto,
    queryRunner: QueryRunner | null = null,
  ): Promise<RestockReportResponse[]> {
    return this.dataSource.createEntityManager(queryRunner).query(
      `
          WITH MonthlySales AS (
              SELECT
                  p.id AS product_id,
                  p.title AS product_name,
                  AVG(s.quantity_sold) AS avg_monthly_sales
              FROM
                  "Sales" s
                      JOIN
                  "Product" p ON s.product_id = p.id
              WHERE
                  s.created_at >= current_date - interval '1 month'
              GROUP BY
                  p.id
          ),
               CurrentInventory AS (
                   SELECT
                       i.product_id,
                       i.physical_quantity AS current_quantity,
                       i.min_stock_threshold
                   FROM
                       "Inventory" i
               ),
               VendorInfo AS (
                   SELECT
                       p.id AS product_id,
                       v.id AS vendor_id,
                       COALESCE(v.name, 'NO_VENDOR') AS vendor_name
                   FROM
                       "Product" p
                           LEFT JOIN
                       "Vendor" v ON p.vendor_id = v.id
               ),
               NeedRestock AS (
                   SELECT
                       c.product_id,
                       c.current_quantity,
                       c.min_stock_threshold,
                       m.avg_monthly_sales,
                       m.product_name,
                       v.vendor_name
                   FROM
                       CurrentInventory c
                           JOIN
                       MonthlySales m ON c.product_id = m.product_id
                           JOIN
                       VendorInfo v ON c.product_id = v.product_id
                   WHERE
                       c.current_quantity + m.avg_monthly_sales <= c.min_stock_threshold
               )
          SELECT
              n.product_id,
              n.product_name,
              n.current_quantity,
              n.min_stock_threshold,
              n.avg_monthly_sales,
              n.vendor_name
          FROM
              NeedRestock n
          LIMIT $1
          OFFSET $2;
    `,
      [limit, limit * --page_number],
    );
  }
}
