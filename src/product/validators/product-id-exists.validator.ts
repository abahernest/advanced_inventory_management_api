import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class ProductIdExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  validate(id: any) {
    return this.dataSource
      .getRepository(ProductEntity)
      .findOne({ where: { id } })
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
