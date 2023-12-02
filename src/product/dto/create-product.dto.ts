import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Currency } from '../entities/product.entity';
import { Type } from 'class-transformer';
import { VendorIdExists } from '../../vendor/validators/vendor-id-exists.validator';

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
