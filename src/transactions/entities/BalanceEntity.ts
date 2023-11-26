import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../libs/entities/BaseEntity';
import { IsNumber, IsUUID } from 'class-validator';
import { CurrencyEntity } from './CurrencyEntity';
import { Exclude } from 'class-transformer';

@Entity()
export class BalanceEntity extends BaseEntity {
  @Column({ nullable: false })
  @IsUUID('4', { always: true })
  ownerId: string;

  @ManyToOne(() => CurrencyEntity, (currency) => currency.balances)
  @Exclude({ toClassOnly: true })
  @JoinColumn({ name: 'currencyId' })
  currency: CurrencyEntity;

  @Column({ nullable: false })
  @IsUUID('4', { always: true })
  currencyId: string;

  @Column({
    type: 'decimal',
    nullable: false,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  @IsNumber()
  amount: number;
}
