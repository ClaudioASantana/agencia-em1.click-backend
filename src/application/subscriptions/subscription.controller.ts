import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

class AssignPlanDto {
  @IsInt()
  planId: number;
}

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as assinaturas (Admin)' })
  findAll() {
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atribuir plano a um usuário (Admin)' })
  assign(@Param('userId') userId: string, @Body() dto: AssignPlanDto) {
    return this.subscriptionService.assign(+userId, dto.planId);
  }
}
