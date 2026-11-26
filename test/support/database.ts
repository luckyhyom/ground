import type { PrismaService } from '../../src/prisma/prisma.service.js';

/** 테스트마다 테이블을 비운다. */
export async function clearDatabase(prisma: PrismaService): Promise<void> {
  await prisma.$transaction([
    prisma.refreshToken.deleteMany(),
    prisma.revokedRefreshTokenFamily.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
