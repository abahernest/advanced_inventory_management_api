import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Index,
} from 'typeorm';

@Entity({
  orderBy: {
    name: 'ASC',
    created_at: 'DESC',
  },
  name: 'Vendor',
})
export class VendorEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    unique: true,
    transformer: {
      to: (value: string): string => value.toLowerCase(),
      from: (value: string): string => value.toLowerCase(),
    },
  })
  public name!: string;

  @Column()
  public phone_number!: string;

  @Column()
  public address!: string;

  @Index('vendor_fts_document_idx')
  @Column({
    type: 'tsvector',
    select: false,
  })
  public fts_document: any;

  @CreateDateColumn()
  public created_at!: Date;

  @UpdateDateColumn()
  public updated_at!: Date;
}
