import {
  IsArray,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VendorEntity } from '../entities/vendor.entity';

export class VendorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;
}

export class CreateVendorDto {
  @IsArray()
  @Type(() => VendorDto)
  @ValidateNested({ each: true })
  vendors: VendorDto[];
}

export enum SortIndex {
  createdAt = 'DATE',
  name = 'NAME',
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
}

export class PaginatedResponseDto {
  meta: {
    page_number?: number;
    limit?: number;
    total?: number;
  };
  data: Partial<VendorEntity>[];
}
