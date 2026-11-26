import type { User } from '../entities/user.entity.js';

/** 응답으로 내보내는 형태. 비밀번호 해시는 절대 포함하지 않는다. */
export class UserResponseDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.createdAt = user.createdAt;
  }
}
