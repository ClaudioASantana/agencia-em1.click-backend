import { Injectable } from '@nestjs/common';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: any): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { establishmentIds, storeName, ...userData } = data;

    const createData: Prisma.UserCreateInput = {
      ...userData,
      password: hashedPassword,
    };

    if (establishmentIds && Array.isArray(establishmentIds)) {
      createData.establishments = {
        connect: establishmentIds.map((id: number) => ({ id })),
      };
    }

    // New Logic: Create Store if storeName is provided
    if (storeName) {
      if (!createData.establishments) {
        createData.establishments = {};
      }

      const slug =
        storeName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
          .replace(/(^-|-$)+/g, '') + // Remove leading/trailing hyphens
        '-' +
        Math.floor(Math.random() * 10000); // Add random suffix for uniqueness

      // Properly structure the create input
      // We need to cast specific parts if types are strict, but structure must be correct:
      // establishments: { create: [ { ...data } ] }

      const newStore = {
        name: storeName,
        slug: slug,
        segmentId: 1,
        locationId: 1, // Also required by schema relation
      };

      // If connect was already set (unlikely in this flow but possible), we shouldn't overwrite it blindly.
      // But typically for registration, it's one or the other.
      // Merging 'create' into the object.

      if ((createData.establishments as any).connect) {
        (createData.establishments as any).create = [newStore];
      } else {
        createData.establishments = {
          create: [newStore],
        };
      }
    }

    return this.prisma.user.create({
      data: createData,
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
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
        password: false, // Exclude password
      },
    }) as unknown as User[];
  }

  async update(id: number, data: any): Promise<User> {
    const { establishmentIds, ...updateData } = data;

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Prepare prisma update data
    const prismaUpdate: Prisma.UserUpdateInput = {
      ...updateData,
    };

    // If establishmentIds is provided, update the relations
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
}
