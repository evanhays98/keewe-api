import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { PaymentService } from '../PaymentService';
import { BalanceService } from '../BalanceService';
import { PaymentEntity } from '../../entities';
import { CurrencyCode } from '../../../libs/enums';

const mockBalance = {
  id: '1',
  amount: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
  ownerId: '1',
  currencyId: '1',
  insertDate: jest.fn(),
  updateBaseEntity: jest.fn(),
  currency: {
    id: '1',
    active: true,
    name: 'US Dollar',
    symbol: '$',
    rates: {
      [CurrencyCode.EUR]: 0.85,
      [CurrencyCode.GBP]: 0.73,
      [CurrencyCode.USD]: 1,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    code: CurrencyCode.USD,
    insertDate: jest.fn(),
    updateBaseEntity: jest.fn(),
  },
};

describe('PaymentService', () => {
  let service: PaymentService;
  let balanceService: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(PaymentEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(true),
            find: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: BalanceService,
          useValue: {
            findByUserAndCurrencyId: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    balanceService = module.get<BalanceService>(BalanceService);
  });

  it('should create a payment successfully', async () => {
    jest
      .spyOn(balanceService, 'findByUserAndCurrencyId')
      .mockResolvedValue(mockBalance);

    await service.create('1', '2', 'USD', 100);

    expect(balanceService.remove).toHaveBeenCalledWith('1', 'USD', 100);
    expect(balanceService.create).toHaveBeenCalledWith('2', 'USD', 100);
  });

  it('should throw an error when balance is insufficient', async () => {
    jest
      .spyOn(balanceService, 'findByUserAndCurrencyId')
      .mockResolvedValue(mockBalance);

    await expect(service.create('1', '2', 'USD', 300)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
