import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserResponseDto } from './dto/user.response.dto.js';
import { UserCredentials } from './entities/user-credentials.js';
import { type CreateUserProps, User } from './entities/user.entity.js';
import { DuplicateEmailError } from './errors/duplicate-email.error.js';
import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /** 비밀번호는 이미 해시된 상태로 받는다. 해시는 AuthService 가 담당한다. */
  async create(
    props: CreateUserProps,
    passwordHash: string,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.create(
        User.create(props),
        passwordHash,
      );
      return user.toResponse();
    } catch (error) {
      if (error instanceof DuplicateEmailError) {
        throw new ConflictException('이미 가입된 이메일입니다.');
      }
      throw error;
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => user.toResponse());
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user.toResponse();
  }

  findEntityById(id: string): Promise<User | undefined> {
    return this.userRepository.findById(id);
  }

  /** 로그인 전용: 비밀번호 검증에만 쓰고, 응답이나 로그로 내보내지 말 것. */
  findCredentialsByEmail(email: string): Promise<UserCredentials | undefined> {
    return this.userRepository.findCredentialsByEmail(email);
  }
}
