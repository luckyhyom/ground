import { randomUUID } from 'node:crypto';
import { UserResponseDto } from '../dto/user.response.dto.js';

export interface CreateUserProps {
  email: string;
  name: string;
  passwordHash: string;
}

export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly passwordHash: string,
    readonly createdAt: Date,
  ) {}

  static create({ email, name, passwordHash }: CreateUserProps): User {
    return new User(randomUUID(), email, name, passwordHash, new Date());
  }

  toResponse(): UserResponseDto {
    return new UserResponseDto(this);
  }
}
