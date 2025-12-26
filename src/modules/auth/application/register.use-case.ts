import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../users/domain/user.repository';
import { User } from '../../users/domain/user.entity';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = User.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      active: dto.active,
      createdAt: new Date(),
    });

    await this.userRepository.save(user);
    return user;
  }
}
