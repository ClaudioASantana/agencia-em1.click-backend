import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @HttpCode(204)
  @ApiOperation({ summary: 'Registrar evento de analytics (público)' })
  async track(@Body() dto: CreateEventDto) {
    // fire-and-forget: retorna imediatamente, processa em background
    void this.analyticsService.track(dto);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dashboard de analytics do lojista' })
  @ApiQuery({ name: 'period', required: false, enum: ['7d', '30d'] })
  @ApiQuery({ name: 'establishmentId', required: false })
  async getDashboard(
    @Req() req: any,
    @Query('period') period: '7d' | '30d' = '30d',
    @Query('establishmentId') establishmentIdParam?: string,
  ) {
    const estId = establishmentIdParam
      ? +establishmentIdParam
      : req.user.establishmentId;

    if (!estId) throw new ForbiddenException('Nenhum estabelecimento associado');

    return this.analyticsService.getDashboard(estId, period);
  }
}
