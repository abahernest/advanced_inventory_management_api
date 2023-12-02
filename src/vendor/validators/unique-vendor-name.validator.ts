import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { VendorService } from '../vendor.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueVendorNameConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @Inject(VendorService)
    private readonly vendorService: VendorService,
  ) {}

  validate(name: any) {
    return name
      ? this.vendorService.findByName(name).then((vendor) => {
          return vendor == undefined;
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
