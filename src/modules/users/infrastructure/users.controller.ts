import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../application/create-user.use-case';
import { CreateUserDto } from '../application/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(createUserDto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
