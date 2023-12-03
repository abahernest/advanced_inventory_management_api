import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InventoryEntity } from '../entities/inventory.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class InventoryIdExistsConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly dataSource: DataSource) {}

  validate(id: any) {
    return this.dataSource
      .getRepository(InventoryEntity)
      .findOne({ where: { id } })
      .then((inventory) => {
        return inventory != undefined;
      })
      .catch(() => false);
  }

  defaultMessage(): string {
    return 'inventory id does not exist';
  }
}

export function InventoryIdExists(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: InventoryIdExistsConstraint,
    });
  };
}
