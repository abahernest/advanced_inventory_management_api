import { IsNumber, IsNumberString, IsOptional, Min } from 'class-validator';
import { InventoryIdExists } from '../validators/inventory-id-exists.validator';

export class UpdateInventoryDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  physical_quantity?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  min_stock_threshold?: number;

  product_id?: number;
}

export class InventoryIdDto {
  @IsNumberString()
  @InventoryIdExists()
  inventory_id: number;
}

export class PaginationDto {
  page_number?: number = 1;
  limit?: number = 10;
}

export class RestockReportResponse {
  product_id: number;
  current_quantity: number;
  avg_monthly_sales: number;
  vendor_name: string;
  product_name: string;
}

export class PaginatedResponseDto {
  meta: {
    page_number?: number;
    limit?: number;
    total?: number;
  };
  data: RestockReportResponse[];
}
