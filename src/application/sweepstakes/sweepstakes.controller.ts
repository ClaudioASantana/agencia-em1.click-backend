import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { SweepstakesService } from './sweepstakes.service';
import { CreateSweepstakeDto } from './dto/create-sweepstake.dto';
import { UpdateSweepstakeDto } from './dto/update-sweepstake.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('sweepstakes')
@Controller('sweepstakes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SweepstakesController {
  constructor(private readonly sweepstakesService: SweepstakesService) {}

  @Roles('STORE_OWNER')
  @Post()
  create(@Request() req, @Body() createSweepstakeDto: CreateSweepstakeDto) {
    return this.sweepstakesService.create(req.user.id, createSweepstakeDto);
  }

  @Roles('STORE_OWNER', 'USER')
  @Get()
  findAll(@Request() req) {
    return this.sweepstakesService.findAll(req.user.id);
  }

  @Roles('STORE_OWNER', 'USER')
  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.sweepstakesService.findOne(+id, req.user.id);
  }

  @Roles('STORE_OWNER')
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateSweepstakeDto: UpdateSweepstakeDto) {
    return this.sweepstakesService.update(+id, req.user.id, updateSweepstakeDto);
  }

  @Roles('STORE_OWNER')
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.sweepstakesService.remove(+id, req.user.id);
  }

  @Roles('STORE_OWNER')
  @Post(':id/tickets')
  issueTicket(@Request() req, @Param('id') id: string, @Body('customerEmail') customerEmail: string) {
    return this.sweepstakesService.issueTicket(+id, req.user.id, customerEmail);
  }
}
