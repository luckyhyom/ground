import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { z } from 'zod';
import { User } from './entities/user.entity.js';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** 내 정보 조회 */
  @Get('me')
  me(@CurrentUser() user: User) {
    return user.toResponse();
  }

  /** 회원 목록 조회 */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /** 회원 단건 조회 */
  @Get(':id')
  findOne(@Param('id', { schema: z.uuid() }) id: string) {
    return this.userService.findOne(id);
  }
}
