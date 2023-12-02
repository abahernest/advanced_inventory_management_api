import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { VendorEntity } from './entities/vendor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniqueVendorNameConstraint } from './validators/unique-vendor-name.validator';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity])],
  controllers: [VendorController],
  providers: [VendorService, UniqueVendorNameConstraint],
  exports: [TypeOrmModule, VendorService, UniqueVendorNameConstraint],
})
export class VendorModule {}
