import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL 환경 변수가 필요합니다.');
    }
    super({
      // MySQL 은 mariadb 드라이버 어댑터로 연결한다. (Prisma 7)
      adapter: new PrismaMariaDb(url),
      // users 를 읽을 때 비밀번호 해시는 기본으로 빼고 읽는다.
      // 필요한 곳(로그인)에서만 omit: { passwordHash: false } 로 명시해서 읽는다.
      omit: { user: { passwordHash: true } },
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
