import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { VendorEntity } from './entities/vendor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueVendorNameConstraint } from './validators/unique-vendor-name.validator';
import { VendorIdExistsConstraint } from './validators/vendor-id-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity])],
  controllers: [VendorController],
  providers: [
    VendorService,
    UniqueVendorNameConstraint,
    VendorIdExistsConstraint,
  ],
  exports: [
    TypeOrmModule,
    VendorService,
    UniqueVendorNameConstraint,
    VendorIdExistsConstraint,
  ],
})
export class VendorModule {}
