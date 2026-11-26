import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@nestjs/authentication';
import { UserModule } from '../user/user.module.js';
import { AuthOptionsFactory } from './auth-options.factory.js';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtAuthProvider } from './jwt-auth.provider.js';
import { PrismaRefreshTokenStore } from './prisma-refresh-token.store.js';

@Module({
  imports: [
    // 전역 가드를 등록한다: @Public() 이 없는 라우트는 모두 로그인이 필요하다.
    AuthenticationModule.forRootAsync({ useClass: AuthOptionsFactory }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthProvider, PrismaRefreshTokenStore],
})
export class AuthModule {}
