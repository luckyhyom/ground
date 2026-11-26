import { randomUUID } from 'node:crypto';
import { UserResponseDto } from '../dto/user.response.dto.js';

export interface CreateUserProps {
  email: string;
  name: string;
  passwordHash: string;
}

export interface UserProps extends CreateUserProps {
  id: string;
  createdAt: Date;
}

export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly passwordHash: string,
    readonly createdAt: Date,
  ) {}

  /** 새 사용자 */
  static create({ email, name, passwordHash }: CreateUserProps): User {
    return new User(randomUUID(), email, name, passwordHash, new Date());
  }

  /** 저장소에서 읽은 사용자 */
  static from({ id, email, name, passwordHash, createdAt }: UserProps): User {
    return new User(id, email, name, passwordHash, createdAt);
  }

  toResponse(): UserResponseDto {
    return new UserResponseDto(this);
  }
}
