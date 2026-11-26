import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { InMemoryUserRepository } from '../../../test/fakes/in-memory-user.repository.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

describe('UserService', () => {
  let service: UserService;

  const props = { email: 'a@example.com', name: '홍길동' };
  const passwordHash = '$scrypt$hash';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useClass: InMemoryUserRepository },
      ],
    }).compile();

    service = module.get(UserService);
  });

  it('생성한 사용자를 돌려준다', async () => {
    const user = await service.create(props, passwordHash);

    expect(user).toEqual({
      id: expect.any(String),
      email: props.email,
      name: props.name,
      createdAt: expect.any(Date),
    });
  });

  it('엔티티에는 비밀번호 해시가 없고, 해시는 credentials 로만 읽는다', async () => {
    const created = await service.create(props, passwordHash);

    const entity = await service.findEntityById(created.id);
    expect(entity).not.toHaveProperty('passwordHash');

    await expect(service.findCredentialsByEmail(props.email)).resolves.toEqual({
      userId: created.id,
      passwordHash,
    });
  });

  it('같은 이메일로 다시 만들면 409', async () => {
    await service.create(props, passwordHash);
    await expect(service.create(props, passwordHash)).rejects.toThrow(
      ConflictException,
    );
  });

  it('만든 사용자를 id로 조회한다', async () => {
    const created = await service.create(props, passwordHash);
    await expect(service.findOne(created.id)).resolves.toEqual(created);
    await expect(service.findAll()).resolves.toEqual([created]);
  });

  it('없는 id를 조회하면 404', async () => {
    await expect(
      service.findOne('00000000-0000-4000-8000-000000000000'),
    ).rejects.toThrow(NotFoundException);
  });
});
