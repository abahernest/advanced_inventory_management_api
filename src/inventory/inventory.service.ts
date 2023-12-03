import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { UpdateInventoryDto } from './dto/inventory.dto';
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
}
