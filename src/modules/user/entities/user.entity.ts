import { randomUUID } from 'node:crypto';
import { UserResponseDto } from '../dto/user.response.dto.js';

export interface CreateUserProps {
  email: string;
  name: string;
}

export interface UserProps extends CreateUserProps {
  id: string;
  createdAt: Date;
}

/**
 * 도메인에서 쓰는 사용자. 비밀번호 해시는 일부러 갖지 않는다:
 * 엔티티를 어디로 넘기거나 응답에 써도 비밀번호가 새지 않게 하기 위해서다.
 * 해시는 로그인할 때만 UserRepository.findCredentialsByEmail() 로 따로 읽는다.
 */
export class User {
  private constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly createdAt: Date,
  ) {}

  /** 새 사용자 */
  static create({ email, name }: CreateUserProps): User {
    return new User(randomUUID(), email, name, new Date());
  }

  /** 저장소에서 읽은 사용자 */
  static from({ id, email, name, createdAt }: UserProps): User {
    return new User(id, email, name, createdAt);
  }

  toResponse(): UserResponseDto {
    return new UserResponseDto(this);
  }
}
