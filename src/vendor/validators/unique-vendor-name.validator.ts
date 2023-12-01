import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { VendorService } from '../vendor.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueVendorNameConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly vendorService: VendorService) {}

  validate(name: any) {
    return name
      ? this.vendorService.findByName(name).then((vendor) => {
          return vendor != undefined;
        })
      : false;
  }

  defaultMessage(): string {
    return 'vendor name already exists.';
  }
}

export function UniqueVendorName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UniqueVendorNameConstraint,
    });
  };
}
