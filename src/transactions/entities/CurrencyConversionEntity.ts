import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../libs/entities/BaseEntity';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';
import { Status } from '../../libs/enums';

@Entity()
export class CurrencyConversionEntity extends BaseEntity {
  @Column({ nullable: false })
  @IsUUID('4', { always: true })
  ownerId: string;

  @Column({ nullable: false })
  @IsUUID('4', { always: true })
  fromCurrencyId: string;

  @Column({ nullable: false })
  @IsUUID('4', { always: true })
  toCurrencyId: string;

  @Column({ nullable: false, default: 0 })
  @IsNumber()
  amount: number;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @IsNumber()
  rate: number;

  @Column({ type: 'enum', enum: Status })
  @IsEnum({ always: true, enum: Status })
  status: Status;
}
