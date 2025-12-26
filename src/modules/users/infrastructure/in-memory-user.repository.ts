import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  async save(user: User): Promise<void> {
    const existingIndex = this.users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }
}
