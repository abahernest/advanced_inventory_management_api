import {
  IsArray,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  phoneNumber: string;
}

export class CreateVendorDto {
  @IsArray()
  @Type(() => VendorDto)
  @ValidateNested({ each: true })
  vendors: VendorDto[];
}