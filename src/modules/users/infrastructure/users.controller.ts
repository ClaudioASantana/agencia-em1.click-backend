import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserUseCase } from '../application/create-user.use-case';
import { CreateUserDto } from '../application/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(createUserDto);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
