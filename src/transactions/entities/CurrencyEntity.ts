import { Column, Entity, OneToMany } from 'typeorm';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from '../../libs/entities/BaseEntity';
import { CurrencyCode } from '../../libs/enums';
import { BalanceEntity } from './BalanceEntity';
import { Exclude, Type } from 'class-transformer';

@Entity()
export class CurrencyEntity extends BaseEntity {
  @Column({ default: true })
  @IsBoolean({ always: true })
  active: boolean;

  @Column({ type: 'enum', enum: CurrencyCode, unique: true })
  @IsEnum({ always: true, enum: CurrencyCode })
  code: CurrencyCode;

  @Column()
  @IsString({ always: true })
  name: string;

  @Column()
  @IsString({ always: true })
  symbol: string;

  @Column({ type: 'jsonb', nullable: true })
  rates: Record<CurrencyCode, number>;

  @OneToMany(() => BalanceEntity, (balance) => balance.currency)
  @Exclude({ toClassOnly: true })
  @Type(() => BalanceEntity)
  @IsOptional()
  balances?: BalanceEntity[];
}
