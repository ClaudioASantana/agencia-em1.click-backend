import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';

@ApiTags('Dialog')
@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('locations')
  @ApiOperation({ summary: 'Get all locations' })
  getLocations() {
    return this.catalogService.getLocations();
  }

  @Get('segments')
  @ApiOperation({ summary: 'Get all segments' })
  getSegments() {
    return this.catalogService.getSegments();
  }
}
