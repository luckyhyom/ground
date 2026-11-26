import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserResponseDto } from './dto/user.response.dto.js';
import { type CreateUserProps, User } from './entities/user.entity.js';
import { DuplicateEmailError } from './errors/duplicate-email.error.js';
import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /** 비밀번호는 이미 해시된 상태로 받는다. 해시는 AuthService 가 담당한다. */
  async create(props: CreateUserProps): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.create(User.create(props));
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

  /** 인증용: 비밀번호 해시를 포함한 엔티티를 돌려준다. 응답으로 내보내지 말 것. */
  findEntityByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findByEmail(email);
  }

  findEntityById(id: string): Promise<User | undefined> {
    return this.userRepository.findById(id);
  }
}
