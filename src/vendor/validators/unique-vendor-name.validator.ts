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
    return this.vendorService
      .findByName(name)
      .then((vendor) => {
        return vendor == undefined;
      })
      .catch(() => false);
  }

  defaultMessage(): string {
    return 'vendor name already exist';
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
