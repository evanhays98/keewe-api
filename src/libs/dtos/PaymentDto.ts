import { IsNumber, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID('4', { always: true })
  recipientId: string;

  @IsUUID('4', { always: true })
  currencyId: string;

  @IsNumber()
  amount: number;
}
