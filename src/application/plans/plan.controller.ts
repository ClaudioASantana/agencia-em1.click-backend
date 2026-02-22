import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os planos' })
  findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter plano por ID' })
  findOne(@Param('id') id: string) {
    return this.planService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar plano (Admin)' })
  create(@Req() req: any, @Body() dto: CreatePlanDto) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException();
    return this.planService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar plano (Admin)' })
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdatePlanDto) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException();
    return this.planService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover plano (Admin)' })
  remove(@Req() req: any, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') throw new ForbiddenException();
    return this.planService.remove(+id);
  }
}
