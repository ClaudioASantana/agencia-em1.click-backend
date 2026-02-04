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
@UseGuards(JwtAuthGuard) // Protect all routes
export class PublicationController {
  constructor(private readonly publicationService: PublicationService) {}

  @Post()
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicationDto: UpdatePublicationDto,
  ) {
    return this.publicationService.update(+id, updatePublicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicationService.remove(+id);
  }
}
