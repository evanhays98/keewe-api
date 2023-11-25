import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CurrencyConversionService } from '../services';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard';
import { CreateCurrencyConversionDto } from '../../libs/dtos/CurrencyConversionDto';
import { Request } from 'express';
import { AuthUser } from '../../libs/dtos';

@Controller('currency-conversions')
export class CurrencyConversionController {
  constructor(
    private readonly currencyConversionService: CurrencyConversionService,
  ) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async convert(
    @Req() req: Request,
    @Body()
    { fromCurrencyId, toCurrencyId, amount }: CreateCurrencyConversionDto,
  ) {
    const user = req.user as AuthUser;
    return this.currencyConversionService.convert(
      user.id,
      fromCurrencyId,
      toCurrencyId,
      amount,
    );
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.currencyConversionService.getHistory(user.id);
  }
}
