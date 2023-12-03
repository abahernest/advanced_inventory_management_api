import { Injectable } from '@nestjs/common';
import { ProductDto, UpdateSingleProductDto } from './dto/create-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from './dto/create-product.dto';

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

  async findAll({
    limit,
    page_number,
    sort_direction,
    sort_index,
    min_price,
    max_price,
    currency,
  }: PaginationDto): Promise<ProductEntity[]> {
    const queryParams = { min_price, currency };
    let queryString = 'p.price >= :min_price AND p.currency = :currency';

    if (max_price) {
      queryString =
        'p.price >= :min_price AND p.price <= :max_price AND p.currency = :currency';
      queryParams['max_price'] = max_price;
    }

    return this.repository
      .createQueryBuilder('p')
      .where(queryString, queryParams)
      .orderBy(sort_index, sort_direction)
      .limit(limit)
      .offset(limit * --page_number)
      .getMany();
  }

  async searchProducts(search: string): Promise<Partial<ProductEntity>[]> {
    return this.repository
      .createQueryBuilder('p')
      .where('p.fts_document @@ plainto_tsquery(:search)', { search })
      .orderBy('ts_rank_cd(p.fts_document, plainto_tsquery(:search))', 'DESC')
      .getMany();
  }
}
