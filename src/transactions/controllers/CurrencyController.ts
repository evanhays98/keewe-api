import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard';
import { CurrencyService } from '../services';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.currencyService.findById(id);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.currencyService.findAll();
  }
}
