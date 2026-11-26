import { PasswordHasher } from '@nestjs/authentication';
import { Test } from '@nestjs/testing';
import { UserRepository } from '../user/user.repository.js';
import { UserService } from '../user/user.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  const input = {
    email: 'a@example.com',
    name: '홍길동',
    password: 'password123',
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        UserRepository,
        { provide: PasswordHasher, useValue: new PasswordHasher({ logN: 10 }) },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  describe('signup', () => {
    it('비밀번호를 해시해서 저장하고, 응답에서는 뺀다', async () => {
      const user = await authService.signup(input);

      expect(user).toMatchObject({ email: input.email, name: input.name });
      expect(user).not.toHaveProperty('passwordHash');
      const stored = userService.findEntityByEmail(input.email)!;
      expect(stored.passwordHash).toMatch(/^\$scrypt\$/);
      expect(stored.passwordHash).not.toContain(input.password);
    });
  });
});
