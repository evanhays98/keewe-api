import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../entities';
import { BalanceService } from './BalanceService';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(PaymentEntity)
    private readonly repo: Repository<PaymentEntity>,
    private readonly balanceService: BalanceService,
  ) {}

  async create(
    userId: string,
    recipientId: string,
    currencyId: string,
    amount: number,
  ) {
    const balance = await this.balanceService.findByUserAndCurrencyId(
      userId,
      currencyId,
    );
    if (balance.amount < amount) {
      throw new ForbiddenException('Insufficient funds');
    }
    await this.balanceService.remove(userId, balance.currency.code, amount);
    await this.balanceService.create(
      recipientId,
      balance.currency.code,
      amount,
    );
    const payment = new PaymentEntity();
    payment.senderId = userId;
    payment.recipientId = recipientId;
    payment.currencyId = currencyId;
    payment.amount = amount;
    return this.repo.save(payment);
  }

  async getHistory(userId: string) {
    // get all payments where senderId or recipientId is userId
    return this.repo.find({
      where: [
        {
          senderId: userId,
        },
        {
          recipientId: userId,
        },
      ],
    });
  }
}
