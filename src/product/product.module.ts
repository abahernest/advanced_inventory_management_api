import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { VendorModule } from '../vendor/vendor.module';
import { ProductIdExistsConstraint } from './validators/product-id-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), VendorModule],
  controllers: [ProductController],
  providers: [ProductService, ProductIdExistsConstraint],
  exports: [TypeOrmModule, ProductService, ProductIdExistsConstraint],
})
export class ProductModule {}
