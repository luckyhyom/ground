import { Injectable } from '@nestjs/common';
import type {
  AuthenticationModuleOptions,
  AuthenticationOptionsFactory,
} from '@nestjs/authentication';

@Injectable()
export class AuthOptionsFactory implements AuthenticationOptionsFactory {
  createAuthenticationOptions(): AuthenticationModuleOptions {
    const key = process.env.JWT_SECRET;
    if (!key) {
      throw new Error('JWT_SECRET 환경 변수가 필요합니다. (32바이트 이상)');
    }
    return {
      accessToken: { key, issuer: 'ground', audience: 'ground', ttl: '15m' },
      refreshToken: { ttl: '30d', absoluteTtl: '90d' },
    };
  }
}
