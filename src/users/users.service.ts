import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { MailService } from '../infrastructure/mail/mail.service';
import * as crypto from 'crypto';

interface CreateUserDto extends Prisma.UserCreateInput {
  establishmentIds?: number[];
  storeName?: string;
}

interface UpdateUserDto extends Prisma.UserUpdateInput {
  establishmentIds?: number[];
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: CreateUserDto): Promise<User> {
    const password = data.password as string;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { establishmentIds, storeName, ...userData } = data;
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const createData: Prisma.UserCreateInput = {
      ...userData,
      password: hashedPassword,
      verificationToken,
      emailVerified: false,
    };

    if (establishmentIds && Array.isArray(establishmentIds)) {
      createData.establishments = {
        connect: establishmentIds.map((id: number) => ({ id })),
      };
    }

    if (storeName) {
      const slug =
        storeName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') +
        '-' +
        Math.floor(Math.random() * 10000);

      const newStore = {
        name: storeName,
        slug: slug,
        segmentId: 1,
        locationId: 1,
      };

      if (createData.establishments && 'connect' in createData.establishments) {
        // Handle existing connect if any
        createData.establishments = {
          ...createData.establishments,
          create: [newStore],
        };
      } else {
        createData.establishments = {
          create: [newStore],
        };
      }
    }

    const user = await this.prisma.user.create({
      data: createData,
    });

    try {
      await this.mailService.sendUserConfirmation(user, verificationToken);
    } catch (error) {
      console.error('Email sending failed during registration:', error);
    }

    return user;
  }

  async findAll(role?: string): Promise<User[]> {
    const where: Prisma.UserWhereInput = {};
    if (role) {
      where.role = role;
    }

    const users = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        active: true,
        establishments: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
    return users as unknown as User[];
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const { establishmentIds, ...updateData } = data;

    if (updateData.password && typeof updateData.password === 'string') {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const prismaUpdate: Prisma.UserUpdateInput = {
      ...updateData,
    };

    if (establishmentIds && Array.isArray(establishmentIds)) {
      prismaUpdate.establishments = {
        set: establishmentIds.map((eid: number) => ({ id: eid })),
      };
    }

    return this.prisma.user.update({
      where: { id },
      data: prismaUpdate,
    });
  }

  async findLojistas() {
    return this.prisma.user.findMany({
      where: {
        role: 'STORE',
        establishments: {
          some: {},
        },
        active: true,
      },
      select: {
        id: true,
        name: true,
        establishments: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}
