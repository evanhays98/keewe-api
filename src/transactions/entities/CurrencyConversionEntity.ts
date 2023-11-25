import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../libs/entities/BaseEntity';
import { IsNumber, IsUUID } from 'class-validator';

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

  @Column({ type: 'decimal', nullable: false })
  @IsNumber()
  rate: number;
}
