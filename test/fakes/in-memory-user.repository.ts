import { UserCredentials } from '../../src/modules/user/entities/user-credentials.js';
import type { User } from '../../src/modules/user/entities/user.entity.js';
import { DuplicateEmailError } from '../../src/modules/user/errors/duplicate-email.error.js';
import type { UserRepository } from '../../src/modules/user/user.repository.js';

/** 단위 테스트용 UserRepository. DB 없이 같은 동작(이메일 중복 시 에러)을 흉내 낸다. */
export class InMemoryUserRepository implements Pick<
  UserRepository,
  'create' | 'findById' | 'findAll' | 'findCredentialsByEmail'
> {
  private readonly users = new Map<string, User>();
  /** DB 처럼 비밀번호 해시는 엔티티와 따로 둔다. (userId → 해시) */
  private readonly passwordHashes = new Map<string, string>();

  async create(user: User, passwordHash: string): Promise<User> {
    if (this.findUserByEmail(user.email)) {
      throw new DuplicateEmailError(user.email);
    }
    this.users.set(user.id, user);
    this.passwordHashes.set(user.id, passwordHash);
    return user;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async findAll(): Promise<User[]> {
    return [...this.users.values()];
  }

  async findCredentialsByEmail(
    email: string,
  ): Promise<UserCredentials | undefined> {
    const user = this.findUserByEmail(email);
    return user
      ? new UserCredentials(user.id, this.passwordHashes.get(user.id)!)
      : undefined;
  }

  private findUserByEmail(email: string): User | undefined {
    return [...this.users.values()].find((user) => user.email === email);
  }
}
