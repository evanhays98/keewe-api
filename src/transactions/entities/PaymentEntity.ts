import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../libs/entities/BaseEntity';
import { IsEnum, IsNumber, IsUUID } from 'class-validator';

enum Status {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
}

@Entity()
export class PaymentEntity extends BaseEntity {
  @Column({ nullable: false })
  @IsUUID('4', { always: true })
  senderId: string;

  @Column({ nullable: false })
  @IsUUID('4', { always: true })
  recipientId: string;

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

  @Column({ type: 'enum', enum: Status })
  @IsEnum({ always: true, enum: Status })
  status: Status;
}
