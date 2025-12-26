import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/users.controller';
import { CreateUserUseCase } from './application/create-user.use-case';
import { InMemoryUserRepository } from './infrastructure/in-memory-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    {
      provide: 'UserRepository',
      useClass: InMemoryUserRepository,
    },
  ],
})
export class UsersModule {}
