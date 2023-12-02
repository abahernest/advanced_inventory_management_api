import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ nullable: true })
  @Index('product_vendor_id_idx')
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
