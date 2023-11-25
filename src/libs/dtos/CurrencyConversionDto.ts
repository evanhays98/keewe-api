import { IsNumber, IsUUID } from 'class-validator';

export class CreateCurrencyConversionDto {
  @IsUUID('4', { always: true })
  fromCurrencyId: string;

  @IsUUID('4', { always: true })
  toCurrencyId: string;

  @IsNumber()
  amount: number;
}
