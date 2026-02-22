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
  Query,
} from '@nestjs/common';
import { PublicationService } from './publication.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { PlanGuard } from '../plans/plan.guard';
import { PlanResource } from '../plans/plan-resource.decorator';

@Controller('publications')
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PlanGuard)
  @PlanResource('publication')
  create(@Request() req, @Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationService.create(createPublicationDto);
  }

  @Get()
  findAll(@Request() req, @Query('establishmentId') queryEstId?: string) {
    const idToUse = queryEstId ? +queryEstId : req.user?.establishmentId;
    if (idToUse) {
      return this.publicationService.findAll(+idToUse);
    }
    return [];
  }

  @Get('my-publications')
  @UseGuards(JwtAuthGuard)
  async findMyPublications(@Request() req) {
    try {
      const userId = req.user?.userId;
      if (!userId) return [];
      return await this.publicationService.findByUserId(userId);
    } catch (error) {
      console.error('❌ [Publications] Error in findMyPublications:', error);
      return { statusCode: 500, message: error.message };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationService.update(+id, updatePublicationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.publicationService.remove(+id);
  }
}
