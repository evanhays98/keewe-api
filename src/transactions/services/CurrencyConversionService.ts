import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyConversionEntity } from '../entities/CurrencyConversionEntity';
import { BalanceService } from './BalanceService';
import { Status } from '../../libs/enums';

@Injectable()
export class CurrencyConversionService {
  private readonly logger = new Logger(CurrencyConversionService.name);

  constructor(
    @InjectRepository(CurrencyConversionEntity)
    private readonly repo: Repository<CurrencyConversionEntity>,
    private readonly balanceService: BalanceService,
  ) {}

  async convert(
    userId: string,
    fromCurrencyId: string,
    toCurrencyId: string,
    amount: number,
  ) {
    const fromBalance = await this.balanceService.findByUserAndCurrencyId(
      userId,
      fromCurrencyId,
    );
    if (!fromBalance) {
      throw new ForbiddenException('Balance not found');
    }
    if (fromBalance.amount < amount) {
      throw new ForbiddenException('Insufficient funds');
    }
    const toBalance = await this.balanceService.findByUserAndCurrencyIdOrCreate(
      userId,
      toCurrencyId,
    );
    const rate = fromBalance.currency.rates[toBalance.currency.code];
    await this.balanceService.remove(userId, fromBalance.currency.code, amount);
    await this.balanceService.create(
      userId,
      toBalance.currency.code,
      amount * rate,
    );
    const conversion = new CurrencyConversionEntity();
    conversion.ownerId = userId;
    conversion.fromCurrencyId = fromCurrencyId;
    conversion.toCurrencyId = toCurrencyId;
    conversion.amount = amount;
    conversion.rate = rate;
    conversion.status = Status.SUCCESS;
    return this.repo.save(conversion);
  }

  async getHistory(userId: string) {
    return this.repo.find({
      where: {
        ownerId: userId,
      },
    });
  }
}
