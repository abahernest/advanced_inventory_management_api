import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { SalesDto } from './dto/sales.dto';
import { SalesEntity } from './entities/sales.entity';

@Injectable()
export class SalesService {
  constructor(private readonly dataSource: DataSource) {}

  async bulkCreate(
    salesDtoArray: SalesDto[],
    queryRunner: QueryRunner | null = null,
  ): Promise<SalesEntity[]> {
    const sales = await this.dataSource
      .createEntityManager(queryRunner)
      .save(SalesEntity, salesDtoArray);
    return sales as SalesEntity[];
  }
}
