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

@Controller('publications')
// @UseGuards(JwtAuthGuard) // Removed to allow public access to GET
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() createPublicationDto: CreatePublicationDto) {
    // Force establishment ID from logged user context if needed,
    // but typically user context has establishment ID?
    // Assuming req.user has establishmentId or logic to find it.
    // For now, trust DTO or override if we have user context.
    // Let's assume DTO is primary but we validate ownership in a real scenario.
    return this.publicationService.create(createPublicationDto);
  }

  @Get()
  findAll(@Request() req, @Query('establishmentId') queryEstId?: string) {
    // If query param is provided (e.g. by admin or switching context), use it.
    // Otherwise fallback to user's linked establishment.

    // TODO: Add permission check to ensure user is allowed to view this establishment's publications
    // For now, assuming Admin or proper context.

    const idToUse = queryEstId ? +queryEstId : req.user?.establishmentId;
    console.log(
      'FIND ALL PUB - Query:',
      queryEstId,
      'UserEst:',
      req.user?.establishmentId,
      'Final:',
      idToUse,
    );

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
      console.log(
        '📡 [Publications] findMyPublications called - UserID:',
        userId,
      );
      if (!userId) {
        console.log('⚠️ [Publications] No UserID found in request');
        return [];
      }
      const results = await this.publicationService.findByUserId(userId);
      console.log(
        `✅ [Publications] Found ${results.length} publications for UserID ${userId}`,
      );
      // Temporarily return simple object to check serialization
      return results;
    } catch (error) {
      console.error('❌ [Publications] Error in findMyPublications:', error);
      return {
        statusCode: 500,
        message: error.message,
        stack: error.stack,
      };
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
