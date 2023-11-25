import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard';
import { CurrencyService } from '../services';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.currencyService.findAll();
  }
}
