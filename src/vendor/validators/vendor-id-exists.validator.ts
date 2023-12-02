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
export class VendorIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(VendorService)
    private readonly vendorService: VendorService,
  ) {}

  validate(id: number) {
    return this.vendorService
      .findById(id)
      .then((vendor) => {
        return vendor != undefined;
      })
      .catch(() => false);
  }

  defaultMessage(): string {
    return 'vendor id does not exist';
  }
}

export function VendorIdExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: VendorIdExistsConstraint,
    });
  };
}
