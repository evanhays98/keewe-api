import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from '../services';
import { Request } from 'express';
import { AuthUser, CreatePaymentDto } from '../../libs/dtos';
import { JwtAuthGuard } from '../../auth/guards/jwtAuthGuard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('')
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: Request,
    @Body() { recipientId, currencyId, amount }: CreatePaymentDto,
  ) {
    const user = req.user as AuthUser;
    return this.paymentService.create(user.id, recipientId, currencyId, amount);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getHistory(@Req() req: Request) {
    const user = req.user as AuthUser;
    return this.paymentService.getHistory(user.id);
  }
}
