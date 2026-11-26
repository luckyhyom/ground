import { Injectable } from '@nestjs/common';
import {
  AuthenticationRegistry,
  JwtBearerProvider,
  type JwtClaims,
} from '@nestjs/authentication';
import { User } from '../user/entities/user.entity.js';
import { UserService } from '../user/user.service.js';

/** `Authorization: Bearer <access token>` 를 검증하고 토큰의 sub 로 사용자를 불러온다. */
@Injectable()
export class JwtAuthProvider extends JwtBearerProvider<User> {
  constructor(
    private readonly userService: UserService,
    registry: AuthenticationRegistry,
  ) {
    super();
    registry.registerProvider(this);
  }

  protected validate({ sub }: JwtClaims): User | undefined {
    return sub ? this.userService.findEntityById(sub) : undefined;
  }
}
