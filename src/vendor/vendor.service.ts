import { Injectable } from '@nestjs/common';
import { VendorEntity } from './entities/vendor.entity';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly repository: Repository<VendorEntity>,
  ) {}
  async create(
    createVendorDto: VendorDto[],
  ): Promise<Pick<VendorEntity, 'id' | 'createdAt' | 'updatedAt'>[]> {
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
    return this.repository.find({
      where: [{ id: In(ids) }, { name: In(names) }],
    });
  }
}
