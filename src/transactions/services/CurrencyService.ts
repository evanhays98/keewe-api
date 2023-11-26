import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyEntity } from '../entities';
import { CurrencyCode } from '../../libs/enums';
import * as https from 'https';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly repo: Repository<CurrencyEntity>,
  ) {}

  async findOneByCode(code: CurrencyCode) {
    return this.repo.findOne({
      where: {
        code,
      },
    });
  }

  async findById(id: string) {
    return this.repo.findOne({
      where: {
        id,
      },
    });
  }

  async findAll() {
    return this.repo.find();
  }

  async updateAllCurrencies() {
    const currencies = await this.repo.find();
    const currencyCodes = currencies.map((currency) => currency.code);
    currencyCodes.forEach((currencyCode) => {
      this.updateCurrency(currencyCode, currencyCodes);
    });
  }

  async updateCurrency(baseCurrency: CurrencyCode, currencies: CurrencyCode[]) {
    const apiKey = process.env.CURRENCY_API_KEY;
    if (!apiKey) {
      this.logger.error('Missing CURRENCY_API_KEY');
      return;
    }
    const stringCurrencies = currencies.join(',');
    const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${baseCurrency}&currencies=${stringCurrencies}`;

    https
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', async () => {
          const result = JSON.parse(data);
          const rates = result.data;
          const transformedRates: Record<CurrencyCode, number> = Object.keys(
            rates,
          ).reduce((acc, key) => {
            const currencyCode = key as CurrencyCode;
            acc[currencyCode] = rates[key].value;
            return acc;
          }, {} as Record<CurrencyCode, number>);
          const currency = await this.repo.findOne({
            where: {
              code: baseCurrency,
            },
          });
          currency.rates = transformedRates;
          await this.repo.save(currency);
        });
      })
      .on('error', (err) => {
        console.log('Error: ' + err.message);
      });
  }
}
