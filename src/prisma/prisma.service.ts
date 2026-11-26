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
    // MySQL 은 mariadb 드라이버 어댑터로 연결한다. (Prisma 7)
    super({ adapter: new PrismaMariaDb(url) });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
