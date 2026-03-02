import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('public-users')
@Controller('public-users')
export class PublicUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('lojistas')
  @ApiOperation({ summary: 'List all lojistas for public filtering' })
  async findLojistas() {
    return this.usersService.findLojistas();
  }
}
