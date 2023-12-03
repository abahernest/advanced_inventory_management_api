import { ProductEntity } from '../../product/entities/product.entity';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  orderBy: {
    created_at: 'DESC',
  },
  name: 'Sales',
})
export class SalesEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => ProductEntity, (product) => product.id, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'product_id' })
  public product: ProductEntity;

  @Column({ nullable: false })
  product_id: number;

  @Column('integer')
  public quantity_sold: number;

  @Column('integer')
  public total_amount?: number;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;
}
