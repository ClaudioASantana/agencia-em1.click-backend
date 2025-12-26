import { Module } from '@nestjs/common';
import { UsersController } from './infrastructure/users.controller';
import { CreateUserUseCase } from './application/create-user.use-case';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    CreateUserUseCase,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
  ],
  exports: ['UserRepository'],
})
export class UsersModule {}
