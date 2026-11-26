import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

describe('UserService', () => {
  let service: UserService;

  const props = {
    email: 'a@example.com',
    name: '홍길동',
    passwordHash: '$scrypt$hash',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService, UserRepository],
    }).compile();

    service = module.get(UserService);
  });

  it('생성한 사용자를 응답할 때 비밀번호 해시를 뺀다', () => {
    const user = service.create(props);

    expect(user).toEqual({
      id: expect.any(String),
      email: props.email,
      name: props.name,
      createdAt: expect.any(Date),
    });
    expect(user).not.toHaveProperty('passwordHash');
    expect(service.findEntityByEmail(props.email)?.passwordHash).toBe(
      props.passwordHash,
    );
  });

  it('같은 이메일로 다시 만들면 409', () => {
    service.create(props);
    expect(() => service.create(props)).toThrow(ConflictException);
  });

  it('만든 사용자를 id로 조회한다', () => {
    const created = service.create(props);
    expect(service.findOne(created.id)).toEqual(created);
    expect(service.findAll()).toEqual([created]);
  });

  it('없는 id를 조회하면 404', () => {
    expect(() =>
      service.findOne('00000000-0000-4000-8000-000000000000'),
    ).toThrow(NotFoundException);
  });
});
