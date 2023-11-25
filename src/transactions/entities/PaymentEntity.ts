import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../libs/entities/BaseEntity';
import { IsNumber, IsUUID } from 'class-validator';

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

  @Column({ type: 'decimal', nullable: false, default: 0 })
  @IsNumber()
  amount: number;
}
