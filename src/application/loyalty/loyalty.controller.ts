import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { CreateLoyaltyDto } from './dto/create-loyalty.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('loyalty')
@Controller('loyalty')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LoyaltyController {
  constructor(private readonly loyaltyService: LoyaltyService) {}

  @Roles('STORE_OWNER')
  @Get()
  fetchPoints(@Request() req) {
    return this.loyaltyService.fetchPoints(req.user.id);
  }

  @Roles('STORE_OWNER')
  @Post('add')
  addPoints(@Request() req, @Body() createLoyaltyDto: CreateLoyaltyDto) {
    return this.loyaltyService.addPoints(req.user.id, createLoyaltyDto);
  }

  @Roles('USER')
  @Get('my-points')
  fetchCustomerPoints(@Request() req) {
    return this.loyaltyService.fetchCustomerPoints(req.user.id);
  }
}
