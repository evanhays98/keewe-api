import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BalanceEntity } from '../entities';
import { CurrencyService } from './CurrencyService';
import { CurrencyCode } from '../../libs/enums';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    @InjectRepository(BalanceEntity)
    private readonly repo: Repository<BalanceEntity>,
    private readonly currencyService: CurrencyService,
  ) {}

  // Service for test - add balance
  async create(userId: string, currencyCode: CurrencyCode, amount: number) {
    const currency = await this.currencyService.findOneByCode(currencyCode);
    let balance = await this.repo.findOne({
      where: {
        ownerId: userId,
        currencyId: currency.id,
      },
    });
    if (balance) {
      balance.amount += amount;
      return this.repo.save(balance);
    }
    balance = new BalanceEntity();
    balance.ownerId = userId;
    balance.currencyId = currency.id;
    balance.amount = amount;
    return this.repo.save(balance);
  }

  async remove(userId: string, currencyCode: CurrencyCode, amount: number) {
    const currency = await this.currencyService.findOneByCode(currencyCode);
    const balance = await this.repo.findOne({
      where: {
        ownerId: userId,
        currencyId: currency.id,
      },
    });
    if (!balance) {
      throw new ForbiddenException('Balance not found');
    }
    balance.amount -= amount;
    return this.repo.save(balance);
  }

  async findByUserAndCurrency(userId: string, currencyCode: CurrencyCode) {
    const currency = await this.currencyService.findOneByCode(currencyCode);
    return this.repo.findOne({
      where: {
        ownerId: userId,
        currencyId: currency.id,
      },
    });
  }

  async findByUserAndCurrencyId(userId: string, currencyId: string) {
    return this.repo.findOne({
      where: {
        ownerId: userId,
        currencyId,
      },
      relations: ['currency'],
    });
  }

  async findByUserAndCurrencyIdOrCreate(userId: string, currencyId: string) {
    const balance = await this.repo.findOne({
      where: {
        ownerId: userId,
        currencyId,
      },
      relations: ['currency'],
    });
    if (balance) {
      return balance;
    }
    const currency = await this.currencyService.findById(currencyId);
    let newBalance = new BalanceEntity();
    newBalance.ownerId = userId;
    newBalance.currencyId = currency.id;
    newBalance.amount = 0;
    newBalance = await this.repo.save(balance);
    return this.repo.findOne({
      where: {
        id: newBalance.id,
      },
      relations: ['currency'],
    });
  }

  async findByUser(userId: string) {
    return this.repo.find({
      where: {
        ownerId: userId,
      },
      relations: ['currency'],
    });
  }

  async getTotalAmount(userId: string, currencyCode: CurrencyCode) {
    const currency = await this.currencyService.findOneByCode(currencyCode);
    const balances = await this.repo.find({
      where: {
        ownerId: userId,
      },
      relations: ['currency'],
    });
    return balances.reduce((acc, balance) => {
      const rate =
        balance.currency.code === currencyCode
          ? 1
          : currency.rates[balance.currency.code];
      return acc + (balance?.amount || 0) * rate;
    }, 0);
  }
}
