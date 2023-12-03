import { IsNumber, IsNumberString, IsOptional, Min } from "class-validator";
import { InventoryIdExists } from "../validators/inventory-id-exists.validator";

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
