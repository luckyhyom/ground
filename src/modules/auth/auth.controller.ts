import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import {
  type SignupRequestDto,
  signupRequestSchema,
} from './dto/signup.request.dto.js';
import { AuthService } from './auth.service.js';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 회원 가입 (자동 로그인 없음) */
  @Post('signup')
  signup(@Body({ schema: signupRequestSchema }) signupDto: SignupRequestDto) {
    return this.authService.signup(signupDto);
  }
}
