import { AuthenticationStorage } from '@nestjs/authentication';
import { authenticationStoreContract } from '@nestjs/authentication/testing';
import { PrismaRefreshTokenStore } from './../src/modules/auth/prisma-refresh-token.store.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { clearDatabase } from './support/database.js';

// @nestjs/authentication 이 제공하는 저장소 계약 테스트를 실제 MySQL 에 돌린다.
// concurrent: 같은 토큰을 동시에 쓰는 경우 하나만 성공하는지까지 확인한다.
describe('PrismaRefreshTokenStore (MySQL)', () => {
  const prisma = new PrismaService();

  beforeAll(async () => {
    await clearDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const cases = authenticationStoreContract(
    () => ({
      refreshTokens: new PrismaRefreshTokenStore(
        prisma,
        new AuthenticationStorage(),
      ),
    }),
    { contracts: ['refreshTokens'], concurrent: true },
  );

  it.each(cases.map((c) => [c.name, c] as const))('%s', async (_, c) => {
    await c.run();
  });
});
