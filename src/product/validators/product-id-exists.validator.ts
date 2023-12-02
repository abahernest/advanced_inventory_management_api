import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { ProductService } from '../product.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ProductIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  validate(name: any) {
    return this.productService
      .findById(name)
      .then((vendor) => {
        return vendor != undefined;
      })
      .catch(() => false);
  }

  defaultMessage(): string {
    return 'product id does not exist';
  }
}

export function ProductIdExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ProductIdExistsConstraint,
    });
  };
}
