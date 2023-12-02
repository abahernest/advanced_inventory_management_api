import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VendorEntity } from '../../vendor/entities/vendor.entity';

export enum Currency {
  NGN = 'NGN',
  USD = 'USD',
  GBP = 'GBP',
  YEN = 'YEN',
}

@Entity({
  orderBy: {
    title: 'ASC',
    created_at: 'DESC',
  },
  name: 'Product',
})
export class ProductEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    transformer: {
      to: (value: string): string => value.toLowerCase(),
      from: (value: string): string => value.toLowerCase(),
    },
  })
  public title!: string;

  @ManyToOne(() => VendorEntity, (vendor) => vendor.id, { nullable: true, onDelete: 'SET NULL' })
  vendor_id: number;

  @Column('text', { default: '' })
  public description?: string;

  @Column('decimal', { precision: 4, default: 0 })
  public price?: number;

  @Column('integer', { default: 1 })
  public quantity?: number;

  @Column('enum', { enum: Currency, default: Currency.USD })
  public currency?: Currency;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;
}
