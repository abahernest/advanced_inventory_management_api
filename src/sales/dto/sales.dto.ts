import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductIdExists } from '../../product/validators/product-id-exists.validator';
import { Type } from 'class-transformer';

export class SalesDto {
  @IsNumber()
  @Min(0)
  quantity_sold: number;

  @IsNumber()
  @Min(0)
  total_amount!: number;

  @IsNotEmpty()
  @IsNumber()
  @ProductIdExists()
  product_id!: number;
}

export class CreateSalesDto {
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => SalesDto)
  @ValidateNested({ each: true })
  sales_data: SalesDto[];
}
