import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { UserResponseDto } from '../user/dto/user.response.dto.js';
import { UserService } from '../user/user.service.js';
import { LoginRequestDto } from './dto/login.request.dto.js';
import { SignupRequestDto } from './dto/signup.request.dto.js';
import { TokenResponseDto } from './dto/token.response.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  /** 회원 가입. 토큰은 발급하지 않는다: 가입 후 로그인을 따로 해야 한다. */
  async signup({
    email,
    name,
    password,
  }: SignupRequestDto): Promise<UserResponseDto> {
    const passwordHash = await this.passwordHasher.hash(password);
    return this.userService.create({ email, name }, passwordHash);
  }

  async login({ email, password }: LoginRequestDto): Promise<TokenResponseDto> {
    const credentials = await this.userService.findCredentialsByEmail(email);
    // 사용자가 없어도 verify 를 거쳐서, 응답 시간으로 가입 여부가 드러나지 않게 한다.
    const valid = await this.passwordHasher.verify(
      password,
      credentials?.passwordHash,
    );
    if (!credentials || !valid) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }
    const tokens = await this.tokenService.issue(credentials.userId, {
      method: 'password',
      claims: { amr: ['pwd'] },
    });
    return new TokenResponseDto(tokens);
  }

  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    return new TokenResponseDto(await this.tokenService.refresh(refreshToken));
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revoke(refreshToken);
  }
}
