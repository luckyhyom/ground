import { Injectable } from '@nestjs/common';
import {
  AuthenticationStorage,
  type RefreshTokenRecord,
  type RefreshTokenStore,
} from '@nestjs/authentication';
import { Prisma } from '../../generated/prisma/client.js';
import type { RefreshToken } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';

/**
 * refresh token 을 MySQL 에 저장한다. 생성할 때 AuthenticationStorage 에 등록되어
 * 패키지의 기본 인메모리 저장소를 대신한다.
 */
@Injectable()
export class PrismaRefreshTokenStore implements RefreshTokenStore {
  constructor(
    private readonly prisma: PrismaService,
    storage: AuthenticationStorage,
  ) {
    storage.registerSource({ refreshTokens: this });
  }

  async getRefreshToken(id: string): Promise<RefreshTokenRecord | undefined> {
    const row = await this.prisma.refreshToken.findUnique({ where: { id } });
    return row ? this.toRecord(row) : undefined;
  }

  async saveRefreshToken(record: RefreshTokenRecord): Promise<void> {
    // 계열의 최대 수명이 지난 토큰과 폐기 기록은 더 의미가 없으니 지운다.
    // 시각은 DB 가 아니라 TokenService 의 시계(record.createdAt)를 따른다.
    const now = record.createdAt;
    await this.prisma.$transaction([
      this.prisma.refreshToken.deleteMany({
        where: { familyExpiresAt: { lt: now } },
      }),
      this.prisma.revokedRefreshTokenFamily.deleteMany({
        where: { familyExpiresAt: { lt: now } },
      }),
      this.prisma.refreshToken.create({
        data: {
          id: record.id,
          familyId: record.familyId,
          userId: record.userId,
          createdAt: record.createdAt,
          expiresAt: record.expiresAt,
          familyExpiresAt: record.familyExpiresAt,
          usedAt: record.usedAt,
          claims: record.claims as Prisma.InputJsonValue | undefined,
        },
      }),
    ]);
  }

  async markRefreshTokenUsed(id: string, at: Date): Promise<boolean> {
    // 조건부 UPDATE 한 번: 동시에 여러 번 불려도 하나만 true 를 받는다.
    const { count } = await this.prisma.refreshToken.updateMany({
      where: { id, usedAt: null },
      data: { usedAt: at },
    });
    return count === 1;
  }

  async revokeRefreshTokenFamily(familyId: string): Promise<void> {
    const token = await this.prisma.refreshToken.findFirst({
      where: { familyId },
      select: { familyExpiresAt: true },
    });
    await this.prisma.revokedRefreshTokenFamily.createMany({
      data: [{ familyId, familyExpiresAt: token?.familyExpiresAt }],
      skipDuplicates: true,
    });
  }

  async isRefreshTokenFamilyRevoked(familyId: string): Promise<boolean> {
    const row = await this.prisma.revokedRefreshTokenFamily.findUnique({
      where: { familyId },
      select: { familyId: true },
    });
    return row !== null;
  }

  async revokeUserRefreshTokens(userId: string): Promise<void> {
    const families = await this.prisma.refreshToken.groupBy({
      by: ['familyId'],
      where: { userId },
      _max: { familyExpiresAt: true },
    });
    if (families.length === 0) return;
    await this.prisma.revokedRefreshTokenFamily.createMany({
      data: families.map(({ familyId, _max }) => ({
        familyId,
        familyExpiresAt: _max.familyExpiresAt,
      })),
      skipDuplicates: true,
    });
  }

  /** 계약상 선택 필드는 null 이 아니라 undefined 로 돌려준다. */
  private toRecord(row: RefreshToken): RefreshTokenRecord {
    return {
      id: row.id,
      familyId: row.familyId,
      userId: row.userId,
      createdAt: row.createdAt,
      expiresAt: row.expiresAt,
      familyExpiresAt: row.familyExpiresAt,
      usedAt: row.usedAt ?? undefined,
      claims: (row.claims as Record<string, unknown> | null) ?? undefined,
    };
  }
}
