import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Query,
  HttpCode,
  UseGuards,
  Req,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Leads')
@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @ApiOperation({ summary: 'Inscrever para receber ofertas via WhatsApp (público)' })
  async create(@Body() dto: CreateLeadDto) {
    return this.leadService.create(dto);
  }

  @Delete('unsubscribe')
  @HttpCode(204)
  @ApiOperation({ summary: 'Cancelar inscrição de ofertas (público)' })
  async unsubscribe(
    @Query('phone') phone: string,
    @Query('establishmentId', ParseIntPipe) establishmentId: number,
  ) {
    await this.leadService.unsubscribe(phone, establishmentId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar leads de um estabelecimento (lojista/admin)' })
  async getByEstablishment(
    @Query('establishmentId', ParseIntPipe) establishmentId: number,
    @Req() req: any,
  ) {
    const userEstablishments: number[] = req.user.establishmentIds ?? [];
    if (
      req.user.role !== 'ADMIN' &&
      !userEstablishments.includes(establishmentId)
    ) {
      throw new ForbiddenException('Acesso negado');
    }
    return this.leadService.getByEstablishment(establishmentId);
  }
}
