import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { string } from "joi";
@Entity({
  orderBy: {
    name: 'ASC',
    createdAt: 'DESC',
  },
  name: 'Vendor',
})
export class VendorEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    unique: true,
    transformer: { to: (value: string) => value.toLowerCase() },
  })
  public name!: string;

  @Column()
  public phoneNumber!: string;

  @Column()
  public address!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
