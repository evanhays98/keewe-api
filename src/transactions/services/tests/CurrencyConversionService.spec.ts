import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { CurrencyConversionService } from '../CurrencyConversionService';
import { BalanceService } from '../BalanceService';
import { CurrencyCode } from '../../../libs/enums';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CurrencyConversionEntity } from '../../entities';

const mockBalanceUSD = {
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

const mockBalanceEUR = {
  id: '2',
  amount: 200,
  createdAt: new Date(),
  updatedAt: new Date(),
  ownerId: '1',
  currencyId: '2',
  insertDate: jest.fn(),
  updateBaseEntity: jest.fn(),
  currency: {
    id: '2',
    active: true,
    name: 'Euro',
    symbol: '€',
    rates: {
      [CurrencyCode.EUR]: 1,
      [CurrencyCode.GBP]: 0.86,
      [CurrencyCode.USD]: 1.18,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    code: CurrencyCode.EUR,
    insertDate: jest.fn(),
    updateBaseEntity: jest.fn(),
  },
};

describe('CurrencyConversionService', () => {
  let service: CurrencyConversionService;
  let balanceService: BalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyConversionService,
        {
          provide: getRepositoryToken(CurrencyConversionEntity),
          useValue: {
            save: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: BalanceService,
          useValue: {
            findByUserAndCurrencyId: jest.fn(),
            findByUserAndCurrencyIdOrCreate: jest.fn(),
            remove: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CurrencyConversionService>(CurrencyConversionService);
    balanceService = module.get<BalanceService>(BalanceService);
  });

  it('should convert currency successfully', async () => {
    jest
      .spyOn(balanceService, 'findByUserAndCurrencyId')
      .mockResolvedValue(mockBalanceUSD);
    jest
      .spyOn(balanceService, 'findByUserAndCurrencyIdOrCreate')
      .mockResolvedValue(mockBalanceEUR);

    await service.convert('1', 'USD', 'EUR', 100);

    expect(balanceService.remove).toHaveBeenCalledWith('1', 'USD', 100);
    expect(balanceService.create).toHaveBeenCalledWith('1', 'EUR', 85);
  });

  it('should throw an error when balance is insufficient', async () => {
    jest
      .spyOn(balanceService, 'findByUserAndCurrencyId')
      .mockResolvedValue(mockBalanceUSD);

    await expect(service.convert('1', 'USD', 'EUR', 300)).rejects.toThrow(
      HttpException,
    );
  });
});
