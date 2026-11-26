import { Injectable } from '@nestjs/common';
import { PasswordHasher } from '@nestjs/authentication';
import { UserResponseDto } from '../user/dto/user.response.dto.js';
import { UserService } from '../user/user.service.js';
import { SignupRequestDto } from './dto/signup.request.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  /** 회원 가입. 토큰은 발급하지 않는다: 가입 후 로그인을 따로 해야 한다. */
  async signup({
    email,
    name,
    password,
  }: SignupRequestDto): Promise<UserResponseDto> {
    const passwordHash = await this.passwordHasher.hash(password);
    return this.userService.create({ email, name, passwordHash });
  }
}
