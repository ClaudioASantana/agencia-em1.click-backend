import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EstablishmentService } from './establishment.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../../auth/optional-jwt-auth.guard';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { PlanGuard } from '../plans/plan.guard';
import { PlanResource } from '../plans/plan-resource.decorator';

@ApiTags('Establishment')
@Controller('establishments')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'List establishments with optional filters' })
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'segment', required: false })
  @ApiQuery({ name: 'followed', required: false, type: Boolean })
  findAll(
    @Query('location') location?: string,
    @Query('segment') segment?: string,
    @Query('followed') followed?: string,
    @Req() req?: any,
  ) {
    const isFollowed = followed === 'true';
    const userId = req?.user?.userId;
    return this.establishmentService.findAll(location, segment, userId, isFollowed);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PlanGuard)
  @PlanResource('establishment')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new establishment' })
  async create(@Req() req: any, @Body() createDto: CreateEstablishmentDto) {
    return this.establishmentService.create(createDto, req.user.userId);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all establishments (Admin only)' })
  async findAllAdmin() {
    return this.establishmentService.findAllAdmin();
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my establishment details' })
  async findMe(@Req() req: any) {
    const estId = req.user.establishmentId;
    return this.establishmentService.findById(estId);
  }

  @Get('my-units')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all establishments for the logged user' })
  async findMyUnits(@Req() req: any) {
    return this.establishmentService.findByUserId(req.user.userId);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get establishment details by slug' })
  findOne(@Param('slug') slug: string) {
    return this.establishmentService.findOne(slug);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update my establishment details' })
  async updateMe(@Req() req: any, @Body() updateDto: UpdateEstablishmentDto) {
    const estId = req.user.establishmentId;
    if (!estId) {
      throw new ForbiddenException('User is not associated with an establishment');
    }
    return this.establishmentService.update(estId, updateDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a specific establishment by ID (Owner only)' })
  async updateMyUnit(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateDto: UpdateEstablishmentDto,
  ) {
    const userId = req.user.userId;
    const establishmentId = Number(id);
    const myUnits = await this.establishmentService.findByUserId(userId);
    const isOwner = myUnits.some((e) => e.id === establishmentId);
    if (!isOwner) {
      throw new ForbiddenException('You do not have permission to update this establishment');
    }
    return this.establishmentService.update(establishmentId, updateDto);
  }

  @Get('me/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get metrics for the logged establishment' })
  async getMyStats(@Req() req: any) {
    const estId = req.user.establishmentId;
    if (!estId) {
      throw new ForbiddenException('User is not associated with an establishment');
    }
    return this.establishmentService.getStats(estId);
  }
}
