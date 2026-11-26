import { User } from './../src/modules/user/entities/user.entity.js';
import { DuplicateEmailError } from './../src/modules/user/errors/duplicate-email.error.js';
import { UserRepository } from './../src/modules/user/user.repository.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { clearDatabase } from './support/database.js';

describe('UserRepository (MySQL)', () => {
  const prisma = new PrismaService();
  const repository = new UserRepository(prisma);
  const passwordHash = '$scrypt$ln=10,r=8,p=1$salt$hash';

  beforeEach(async () => {
    await clearDatabase(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('기본 조회와 Prisma 결과에는 비밀번호 해시가 없다', async () => {
    const user = User.create({ email: 'a@example.com', name: '홍길동' });
    await repository.create(user, passwordHash);

    await expect(repository.findById(user.id)).resolves.not.toHaveProperty(
      'passwordHash',
    );
    // 저장소를 거치지 않고 Prisma 로 바로 읽어도 전역 omit 으로 빠진다.
    const row = await prisma.user.findUnique({ where: { id: user.id } });
    expect(row).not.toHaveProperty('passwordHash');
  });

  it('비밀번호 해시는 findCredentialsByEmail() 로만 읽는다', async () => {
    const user = User.create({ email: 'a@example.com', name: '홍길동' });
    await repository.create(user, passwordHash);

    await expect(
      repository.findCredentialsByEmail('a@example.com'),
    ).resolves.toEqual({ userId: user.id, passwordHash });
    await expect(
      repository.findCredentialsByEmail('nobody@example.com'),
    ).resolves.toBeUndefined();
  });

  it('같은 이메일이면 DuplicateEmailError', async () => {
    await repository.create(
      User.create({ email: 'a@example.com', name: '홍길동' }),
      passwordHash,
    );
    await expect(
      repository.create(
        User.create({ email: 'a@example.com', name: '김철수' }),
        passwordHash,
      ),
    ).rejects.toThrow(DuplicateEmailError);
  });
});
