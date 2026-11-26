import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserCredentials } from './entities/user-credentials.js';
import { User } from './entities/user.entity.js';
import { DuplicateEmailError } from './errors/duplicate-email.error.js';

/**
 * MySQL 의 users 테이블. Prisma 모델과 User 엔티티를 서로 바꾼다.
 * 비밀번호 해시는 PrismaService 의 전역 omit 으로 기본 조회에서 빠지고,
 * findCredentialsByEmail() 만 명시적으로 읽는다.
 */
@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** 새 사용자를 저장한다. 이메일이 이미 있으면 DuplicateEmailError. */
  async create(user: User, passwordHash: string): Promise<User> {
    try {
      const row = await this.prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name,
          passwordHash,
          createdAt: user.createdAt,
        },
      });
      return User.from(row);
    } catch (error) {
      // P2002: unique 제약 위반. 동시에 같은 이메일로 가입해도 하나만 성공한다.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new DuplicateEmailError(user.email);
      }
      throw error;
    }
  }

  async findById(id: string): Promise<User | undefined> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? User.from(row) : undefined;
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((row) => User.from(row));
  }

  /** 로그인 전용: 비밀번호 해시를 읽는 유일한 메서드. */
  async findCredentialsByEmail(
    email: string,
  ): Promise<UserCredentials | undefined> {
    const row = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });
    return row ? new UserCredentials(row.id, row.passwordHash) : undefined;
  }
}
