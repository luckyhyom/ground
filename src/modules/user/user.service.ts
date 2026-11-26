import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserResponseDto } from './dto/user.response.dto.js';
import { type CreateUserProps, User } from './entities/user.entity.js';
import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /** 비밀번호는 이미 해시된 상태로 받는다. 해시는 AuthService 가 담당한다. */
  create(props: CreateUserProps): UserResponseDto {
    if (this.userRepository.findByEmail(props.email)) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }
    return this.userRepository.save(User.create(props)).toResponse();
  }

  findAll(): UserResponseDto[] {
    return this.userRepository.findAll().map((user) => user.toResponse());
  }

  findOne(id: string): UserResponseDto {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return user.toResponse();
  }

  /** 인증용: 비밀번호 해시를 포함한 엔티티를 돌려준다. 응답으로 내보내지 말 것. */
  findEntityByEmail(email: string): User | undefined {
    return this.userRepository.findByEmail(email);
  }

  findEntityById(id: string): User | undefined {
    return this.userRepository.findById(id);
  }
}
