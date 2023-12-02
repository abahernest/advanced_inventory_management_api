import { Injectable } from '@nestjs/common';
import { VendorEntity } from './entities/vendor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto, SortIndex, VendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly repository: Repository<VendorEntity>,
  ) {}
  async create(
    createVendorDto: VendorDto[],
  ): Promise<Pick<VendorEntity, 'id' | 'created_at' | 'updated_at'>[]> {
    // idempotent operation
    const vendors = await this.repository.upsert(createVendorDto, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: { name: true },
    });
    return vendors.generatedMaps as VendorEntity[];
  }

  async findByName(name: string): Promise<VendorEntity> {
    return await this.repository.findOne({ where: { name } });
  }

  async findManyByIdOrName(
    ids: number[],
    names: string[],
  ): Promise<VendorEntity[]> {
    return this.repository
      .createQueryBuilder('v')
      .where(
        // TODO: sub-optimal. Query not using index
        `v.id = ANY(:ids) OR v.name = ANY (:names)`,
        { ids, names },
      )
      .orderBy('v.created_at', 'DESC')
      .getMany();
  }

  async findAll({
    limit,
    page_number,
    sort_direction,
    sort_index,
  }: PaginationDto): Promise<VendorEntity[]> {
    const filter = { order: {}, skip: limit * --page_number, limit: limit };

    switch (sort_index) {
      case SortIndex.createdAt:
        filter['order'] = { createdAt: sort_direction };
        break;
      case SortIndex.name:
        filter['order'] = { name: sort_direction };
        break;
      default:
        filter['order'] = { name: 'ASC' };
    }

    return this.repository.find({
      order: filter.order,
      skip: filter.skip,
      take: filter.limit,
    });
  }

  async searchVendor(search: string): Promise<Partial<VendorEntity>[]> {
    return this.repository
      .createQueryBuilder('v')
      .where('v.fts_document @@ plainto_tsquery(:search)', { search })
      .orderBy('ts_rank_cd(v.fts_document, plainto_tsquery(:search))', 'DESC')
      .getMany();
  }

  async findById(id: number): Promise<VendorEntity> {
    return this.repository.findOne({ where: { id } });
  }
}
