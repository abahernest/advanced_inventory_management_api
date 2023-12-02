import { Injectable } from '@nestjs/common';
import { ProductDto, UpdateSingleProductDto } from './dto/create-product.dto';
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

  async updateOne(
    id: number,
    updateProductDto: UpdateSingleProductDto,
  ): Promise<Pick<ProductEntity, 'id' | 'created_at' | 'updated_at'>> {
    const updateResult = await this.repository.update({ id }, updateProductDto);
    return updateResult.generatedMaps[0] as ProductEntity;
  }

  async findById(id: number): Promise<ProductEntity> {
    return this.repository.findOne({ where: { id } });
  }
}
