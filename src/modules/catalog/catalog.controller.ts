import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('agencies')
  async getAgencies() {
    return this.catalogService.getAgencies();
  }

  @Get('filters')
  async getFilters() {
    return this.catalogService.getFilters();
  }
}
