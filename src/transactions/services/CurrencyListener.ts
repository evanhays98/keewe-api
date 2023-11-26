import { Injectable, OnModuleInit } from '@nestjs/common';
import { CurrencyService } from './index';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CurrencyListener implements OnModuleInit {
  constructor(private currencyService: CurrencyService) {}

  async onModuleInit() {
    await this.updateCurrency();
  }

  @Cron('0 0 */3 * * *')
  async updateCurrency() {
    return this.currencyService.updateAllCurrencies();
  }
}
