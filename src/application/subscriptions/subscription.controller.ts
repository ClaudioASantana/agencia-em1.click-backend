import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

class AssignPlanDto {
  @IsInt()
  planId: number;
}

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as assinaturas (Admin)' })
  findAll(@Req() req: any) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException();
    return this.subscriptionService.findAll();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter plano do usuário logado' })
  async getMyPlan(@Req() req: any) {
    return this.subscriptionService.getPlanByUserId(req.user.userId);
  }

  @Patch(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atribuir plano a um usuário (Admin)' })
  assign(@Req() req: any, @Param('userId') userId: string, @Body() dto: AssignPlanDto) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException();
    return this.subscriptionService.assign(+userId, dto.planId);
  }
}
