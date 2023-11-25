import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BalanceService } from '../services';
import { AuthUser, CreateBalanceDto } from '../../libs/dtos';
import { CurrencyCode } from '../../libs/enums';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard';
import { Request } from 'express';

@Controller('balances')
export class BalanceController {
  private logger = new Logger(BalanceController.name);

  constructor(private readonly balanceService: BalanceService) {}

  // Route for test and add balance
  @Post(':currencyCode')
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: Request,
    @Param('currencyCode') currencyCode: CurrencyCode,
    @Body() { amount }: CreateBalanceDto,
  ) {
    if (!(currencyCode in CurrencyCode)) {
      throw new BadRequestException('Invalid currency code');
    }
    const user = req.user as AuthUser;
    this.logger.log(
      `Create balance for user ${user.id} with amount ${amount} and currency ${currencyCode}`,
    );
    return this.balanceService.create(user.id, currencyCode, amount);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAll(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.balanceService.findByUser(user.id);
  }

  @Get(':currencyCode')
  @UseGuards(JwtAuthGuard)
  async get(
    @Req() req: Request,
    @Param('currencyCode') currencyCode: CurrencyCode,
  ) {
    if (!(currencyCode in CurrencyCode)) {
      throw new BadRequestException('Invalid currency code');
    }
    const user = req.user as AuthUser;
    return this.balanceService.findByUserAndCurrency(user.id, currencyCode);
  }

  @Get('total-amount/:currencyCode')
  @UseGuards(JwtAuthGuard)
  async getTotalAmount(
    @Req() req: Request,
    @Param('currencyCode') currencyCode: CurrencyCode,
  ) {
    if (!(currencyCode in CurrencyCode)) {
      throw new BadRequestException('Invalid currency code');
    }
    const user = req.user as AuthUser;
    return this.balanceService.getTotalAmount(user.id, currencyCode);
  }
}
