import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SweepstakesService } from './sweepstakes.service';
import { CreateSweepstakeDto } from './dto/create-sweepstake.dto';
import { UpdateSweepstakeDto } from './dto/update-sweepstake.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('sweepstakes')
@UseGuards(JwtAuthGuard)
export class SweepstakesController {
  constructor(private readonly sweepstakesService: SweepstakesService) {}

  @Post()
  create(@Request() req, @Body() createSweepstakeDto: CreateSweepstakeDto) {
    return this.sweepstakesService.create(req.user.id, createSweepstakeDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.sweepstakesService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.sweepstakesService.findOne(+id, req.user.id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSweepstakeDto: UpdateSweepstakeDto,
  ) {
    return this.sweepstakesService.update(+id, req.user.id, updateSweepstakeDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.sweepstakesService.remove(+id, req.user.id);
  }

  @Post(':id/tickets')
  issueTicket(
    @Request() req,
    @Param('id') id: string,
    @Body('customerEmail') customerEmail: string,
  ) {
    return this.sweepstakesService.issueTicket(+id, req.user.id, customerEmail);
  }
}
