import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('loyalty')
@UseGuards(JwtAuthGuard)
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Get('extract')
  getExtract(@Request() req, @Query('customerEmail') customerEmail: string) {
    return this.loyaltyService.getExtract(req.user.id, customerEmail);
  }

  @Post('add')
  addPoints(
    @Request() req,
    @Body('customerEmail') customerEmail: string,
    @Body('amount') amount: number,
    @Body('description') description: string,
  ) {
    return this.loyaltyService.addPoints(req.user.id, customerEmail, amount, description);
  }

  @Post('deduce')
  deducePoints(
    @Request() req,
    @Body('customerEmail') customerEmail: string,
    @Body('amount') amount: number,
    @Body('description') description: string,
  ) {
    return this.loyaltyService.deducePoints(req.user.id, customerEmail, amount, description);
  }
}
