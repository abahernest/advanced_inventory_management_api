import { Injectable } from '@nestjs/common';
import { VendorEntity } from './entities/vendor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { VendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(VendorEntity)
    private readonly vendorRepository: Repository<VendorEntity>,
  ) {}
  async create(createVendorDto: VendorDto[]): Promise<VendorEntity[]> {
    return this.vendorRepository.create(createVendorDto);
  }

  async findByName(name: string): Promise<VendorEntity> {
    return this.vendorRepository.findOne({ where: { name } });
  }
}
