import type { TokenPair } from '@nestjs/authentication';

export class TokenResponseDto {
  readonly accessToken: string;
  readonly refreshToken: string;
  /** access token 만료까지 남은 초 */
  readonly expiresIn: number;

  constructor({ accessToken, refreshToken, expiresIn }: TokenPair) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresIn = expiresIn;
  }
}
