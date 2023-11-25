import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrencyEntity } from '../entities';
import { CurrencyCode } from '../../libs/enums';

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
}
