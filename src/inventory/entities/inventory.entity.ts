import { ProductEntity } from '../../product/entities/product.entity';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne, OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({
  orderBy: {
    physical_quantity: 'ASC',
    created_at: 'DESC',
  },
  name: 'Inventory',
})
export class InventoryEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToOne(() => ProductEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'product_id' })
  public product: ProductEntity;

  @Column({ nullable: false })
  product_id: number;

  @Column('integer', { default: 0 })
  public physical_quantity?: number;

  @Column('integer', { default: 20 })
  public min_stock_threshold?: number;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;
}
