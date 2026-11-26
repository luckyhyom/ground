import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@nestjs/authentication';
import { UserModule } from '../user/user.module.js';
import { AuthOptionsFactory } from './auth-options.factory.js';
import { JwtAuthProvider } from './jwt-auth.provider.js';

@Module({
  imports: [
    // 전역 가드를 등록한다: @Public() 이 없는 라우트는 모두 로그인이 필요하다.
    AuthenticationModule.forRootAsync({ useClass: AuthOptionsFactory }),
    UserModule,
  ],
  providers: [JwtAuthProvider],
})
export class AuthModule {}
