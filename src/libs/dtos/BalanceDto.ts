import { IsNumber } from 'class-validator';

export class CreateBalanceDto {
  @IsNumber()
  amount: number;
}
