import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(user: User): Promise<void> {
    const data = {
      name: user.name,
      email: user.email,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      password: user.password!,
      active: user.props.active,
      createdAt: user.props.createdAt,
    };

    await this.prisma.user.upsert({
      where: { id: user.id },
      update: {
        name: user.name,
        email: user.email,
        password: user.password!,
        active: user.props.active,
        createdAt: user.props.createdAt,
      },
      create: {
        id: user.id,
        ...data,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) {
      return null;
    }

    return this.mapToDomain(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      return null;
    }

    return this.mapToDomain(prismaUser);
  }

  private mapToDomain(prismaUser: any): User {
    return User.create(
      {
        name: prismaUser.name,
        email: prismaUser.email,
        password: prismaUser.password,
        active: prismaUser.active ?? true,
        createdAt: prismaUser.createdAt ?? new Date(),
      },
      prismaUser.id,
    );
  }
}
