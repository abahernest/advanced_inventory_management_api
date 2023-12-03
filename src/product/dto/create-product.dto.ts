import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Currency, ProductEntity } from '../entities/product.entity';
import { Type } from 'class-transformer';
import { VendorIdExists } from '../../vendor/validators/vendor-id-exists.validator';
import { ProductIdExists } from '../validators/product-id-exists.validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNumber()
  @VendorIdExists()
  vendor_id: number;

  @IsOptional()
  @IsEnum(Currency)
  currency: Currency;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  quantity: number;
}

export class CreateProductDto {
  @IsArray()
  @Type(() => ProductDto)
  @ValidateNested({ each: true })
  products: ProductDto[];
}

export class UpdateSingleProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNumber()
  @VendorIdExists()
  vendor_id?: number;

  @IsOptional()
  @IsEnum(Currency)
  currency?: Currency;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}

export class ProductIdDto {
  @IsNumberString()
  @ProductIdExists()
  product_id: number;
}

export enum SortIndex {
  createdAt = 'DATE',
  title = 'TITLE',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PaginationDto {
  page_number?: number = 1;
  limit?: number = 10;
  search?: string = '';
  sort_direction?: SortDirection = SortDirection.ASC;
  sort_index?: SortIndex = SortIndex.createdAt;
  min_price?: number = 0;
  max_price?: number;
  currency?: Currency = Currency.USD;
}

export class PaginatedResponseDto {
  meta: {
    page_number?: number;
    limit?: number;
    total?: number;
  };
  data: Partial<ProductEntity>[];
}
