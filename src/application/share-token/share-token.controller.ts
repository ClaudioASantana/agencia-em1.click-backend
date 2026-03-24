import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShareTokenService } from './share-token.service';
import { CreateShareTokenDto } from './dto/create-share-token.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Share Tokens')
@Controller('share-tokens')
export class ShareTokenController {
  constructor(private readonly shareTokenService: ShareTokenService) {}

  @Post()
  @ApiOperation({
    summary: 'Gerar token de compartilhamento para uma loja (público)',
  })
  async create(@Body() dto: CreateShareTokenDto) {
    return this.shareTokenService.create(dto.establishmentId);
  }

  @Post(':token/visit')
  @HttpCode(204)
  @ApiOperation({ summary: 'Registrar clique em link compartilhado (público)' })
  async visit(@Param('token') token: string) {
    void this.shareTokenService.registerVisit(token);
  }

  @Get('stats/:establishmentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Estatísticas de compartilhamentos do lojista' })
  async getStats(
    @Param('establishmentId') establishmentId: string,
    @Req() req: any,
  ) {
    const estId = +establishmentId;
    const userEstablishments: number[] = req.user.establishmentIds ?? [];

    if (req.user.role !== 'ADMIN' && !userEstablishments.includes(estId)) {
      throw new ForbiddenException('Acesso negado');
    }

    return this.shareTokenService.getStatsByEstablishment(estId);
  }
}
