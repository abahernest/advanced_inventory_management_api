import { Injectable } from '@nestjs/common';
import { ProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  async create(
    createProductDto: ProductDto[],
  ): Promise<Pick<ProductEntity, 'id' | 'created_at' | 'updated_at'>[]> {
    const products = await this.repository.insert(createProductDto);
    return products.generatedMaps as ProductEntity[];
  }

  async findByIds(ids: number[]): Promise<ProductEntity[]> {
    return this.repository
      .createQueryBuilder('v')
      .where(
        // TODO: sub-optimal. Query not using index
        `v.id = ANY(:ids)`,
        { ids },
      )
      .orderBy('v.created_at', 'DESC')
      .getMany();
  }
}
