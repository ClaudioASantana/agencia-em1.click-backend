import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { SegmentService } from './segment.service';

@ApiTags('Segments')
@Controller('segments')
export class SegmentController {
  constructor(private readonly segmentService: SegmentService) {}

  @Get()
  //@UseGuards(JwtAuthGuard) // Optionally public if needed for registration, but usually protected
  //@ApiBearerAuth()
  @ApiOperation({ summary: 'List all segments' })
  async findAll() {
    return this.segmentService.findAll();
  }
}
