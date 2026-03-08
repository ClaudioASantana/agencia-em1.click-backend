import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { QrCodesService } from './qr-codes.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { CreateSlotDto } from './dto/create-slot.dto';
import { CreateImpulseDto } from './dto/create-impulse.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@ApiTags('QR Codes')
@ApiBearerAuth()
@Controller('qr')
@UseGuards(JwtAuthGuard)
export class QrCodesController {
  constructor(private readonly service: QrCodesService) {}

  // ── Templates (Admin) ──────────────────────────────────────────────────────

  @Post('templates')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar template de QR (Admin)' })
  createTemplate(@Body() dto: CreateTemplateDto) {
    return this.service.createTemplate(dto);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Listar templates de QR' })
  findAllTemplates() {
    return this.service.findAllTemplates();
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Obter template de QR por ID' })
  findOneTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneTemplate(id);
  }

  @Patch('templates/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar template de QR (Admin)' })
  updateTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateTemplateDto>,
  ) {
    return this.service.updateTemplate(id, dto);
  }

  @Delete('templates/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover template de QR (Admin)' })
  deleteTemplate(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteTemplate(id);
  }

  // ── Slots (Admin) ──────────────────────────────────────────────────────────

  @Post('templates/:id/slots')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Adicionar slot ao template (Admin)' })
  addSlot(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateSlotDto) {
    return this.service.addSlot(id, dto);
  }

  @Delete('slots/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover slot (Admin)' })
  removeSlot(@Param('id', ParseIntPipe) id: number) {
    return this.service.removeSlot(id);
  }

  // ── Impulses (Admin) ───────────────────────────────────────────────────────

  @Post('impulses')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar impulse de QR (Admin)' })
  createImpulse(@Body() dto: CreateImpulseDto) {
    return this.service.createImpulse(dto);
  }

  @Get('impulses')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todos os impulses (Admin)' })
  findAllImpulses() {
    return this.service.findAllImpulses();
  }

  // ── Geração de QR codes ────────────────────────────────────────────────────

  @Post('impulses/:id/generate')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Gerar imagens de QR (Admin)' })
  generateImages(@Param('id', ParseIntPipe) id: number) {
    return this.service.generateImages(id);
  }

  // ── Lojista: ver seus próprios impulsos ────────────────────────────────────

  @Get('my-impulses/:establishmentId')
  @ApiOperation({ summary: 'Ver impulses do estabelecimento do lojista' })
  findMyImpulses(
    @Param('establishmentId', ParseIntPipe) establishmentId: number,
  ) {
    return this.service.findImpulsesByEstablishment(establishmentId);
  }

  // ── Encartes (Admin) ───────────────────────────────────────────────────────

  @Post('encartes')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Gerar encarte de QR (Admin)' })
  generateEncarte(@Body() dto: any) {
    // Use any or Import CreateEncarteDto
    return this.service.generateEncarte(dto);
  }

  @Get('encartes')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Listar todos os encartes (Admin)' })
  findAllEncartes() {
    return this.service.findAllEncartes();
  }

  @Delete('encartes/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover encarte (Admin)' })
  deleteEncarte(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteEncarte(id);
  }
}
