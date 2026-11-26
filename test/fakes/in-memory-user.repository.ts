import type { User } from '../../src/modules/user/entities/user.entity.js';
import { DuplicateEmailError } from '../../src/modules/user/errors/duplicate-email.error.js';
import type { UserRepository } from '../../src/modules/user/user.repository.js';

/** 단위 테스트용 UserRepository. DB 없이 같은 동작(이메일 중복 시 에러)을 흉내 낸다. */
export class InMemoryUserRepository implements Pick<
  UserRepository,
  'create' | 'findById' | 'findByEmail' | 'findAll'
> {
  private readonly users = new Map<string, User>();

  async create(user: User): Promise<User> {
    if (await this.findByEmail(user.email)) {
      throw new DuplicateEmailError(user.email);
    }
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return [...this.users.values()].find((user) => user.email === email);
  }

  async findAll(): Promise<User[]> {
    return [...this.users.values()];
  }
}
