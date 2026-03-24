import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PlanGuard } from '../plans/plan.guard';
import { PlanResource } from '../plans/plan-resource.decorator';

@ApiTags('Offer')
@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PlanGuard)
  @PlanResource('offer')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new offer' })
  async create(@Req() req: any, @Body() createOfferDto: CreateOfferDto) {
    return this.offerService.create(createOfferDto);
  }

  @Get()
  @ApiOperation({ summary: 'List offers' })
  @ApiQuery({ name: 'establishmentId', required: false })
  @ApiQuery({ name: 'publicationId', required: false })
  findAll(
    @Query('establishmentId') establishmentId?: string,
    @Query('publicationId') publicationId?: string,
  ) {
    return this.offerService.findAll(
      establishmentId ? +establishmentId : undefined,
      publicationId ? +publicationId : undefined,
    );
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get offer by ID or Slug' })
  findOne(@Param('idOrSlug') idOrSlug: string) {
    if (/^\d+$/.test(idOrSlug)) {
      return this.offerService.findOne(+idOrSlug);
    }
    return this.offerService.findBySlug(idOrSlug);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an offer' })
  update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.userId;
    return this.offerService.update(+id, updateOfferDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an offer' })
  remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.role === 'ADMIN' ? undefined : req.user?.userId;
    return this.offerService.remove(+id, userId);
  }
}
