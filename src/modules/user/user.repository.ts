import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity.js';

/**
 * 인메모리 저장소. DB를 붙일 때 이 클래스만 교체하면 된다.
 */
@Injectable()
export class UserRepository {
  private readonly users = new Map<string, User>();

  save(user: User): User {
    this.users.set(user.id, user);
    return user;
  }

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  findByEmail(email: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  findAll(): User[] {
    return [...this.users.values()];
  }
}
