import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../application/use-case.interface';
import { CreateUserDto } from './create-user.dto';
import { User } from '../domain/user.entity';
import { UserRepository } from '../domain/user.repository';

@Injectable()
export class CreateUserUseCase implements UseCase<CreateUserDto, User> {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(request: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = User.create({
      name: request.name,
      email: request.email,
      createdAt: new Date(),
    });

    await this.userRepository.save(user);
    return user;
  }
}
