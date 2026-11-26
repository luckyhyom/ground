import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '@nestjs/authentication';
import {
  type LoginRequestDto,
  loginRequestSchema,
} from './dto/login.request.dto.js';
import {
  type RefreshTokenRequestDto,
  refreshTokenRequestSchema,
} from './dto/refresh-token.request.dto.js';
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

  /** 로그인: access token + refresh token 발급 */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body({ schema: loginRequestSchema }) loginDto: LoginRequestDto) {
    return this.authService.login(loginDto);
  }

  /** refresh token 으로 토큰 재발급 (refresh token 은 1회용, 회전됨) */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @Body({ schema: refreshTokenRequestSchema })
    { refreshToken }: RefreshTokenRequestDto,
  ) {
    return this.authService.refresh(refreshToken);
  }

  /** 로그아웃: 해당 refresh token 계열을 폐기 */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(
    @Body({ schema: refreshTokenRequestSchema })
    { refreshToken }: RefreshTokenRequestDto,
  ) {
    return this.authService.logout(refreshToken);
  }
}
