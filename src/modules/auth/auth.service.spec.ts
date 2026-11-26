import { UnauthorizedException } from '@nestjs/common';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { Test } from '@nestjs/testing';
import { InMemoryUserRepository } from '../../../test/fakes/in-memory-user.repository.js';
import { UserRepository } from '../user/user.repository.js';
import { UserService } from '../user/user.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  const tokenService = { issue: vi.fn(), refresh: vi.fn(), revoke: vi.fn() };

  const input = {
    email: 'a@example.com',
    name: '홍길동',
    password: 'password123',
  };

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        { provide: UserRepository, useClass: InMemoryUserRepository },
        { provide: PasswordHasher, useValue: new PasswordHasher({ logN: 10 }) },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  describe('signup', () => {
    it('비밀번호를 해시해서 저장하고, 토큰은 발급하지 않는다', async () => {
      const user = await authService.signup(input);

      expect(user).toMatchObject({ email: input.email, name: input.name });
      expect(user).not.toHaveProperty('passwordHash');
      const stored = (await userService.findEntityByEmail(input.email))!;
      expect(stored.passwordHash).toMatch(/^\$scrypt\$/);
      expect(stored.passwordHash).not.toContain(input.password);
      expect(tokenService.issue).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('비밀번호가 맞으면 사용자 id 로 토큰을 발급한다', async () => {
      const user = await authService.signup(input);
      tokenService.issue.mockResolvedValue({
        accessToken: 'a',
        refreshToken: 'r',
        expiresIn: 900,
      });

      await expect(
        authService.login({ email: input.email, password: input.password }),
      ).resolves.toEqual({
        accessToken: 'a',
        refreshToken: 'r',
        expiresIn: 900,
      });
      expect(tokenService.issue).toHaveBeenCalledWith(
        user.id,
        expect.anything(),
      );
    });

    it('비밀번호가 틀리면 401', async () => {
      await authService.signup(input);
      await expect(
        authService.login({ email: input.email, password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
      expect(tokenService.issue).not.toHaveBeenCalled();
    });

    it('없는 이메일이면 401', async () => {
      await expect(
        authService.login({
          email: 'nobody@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
