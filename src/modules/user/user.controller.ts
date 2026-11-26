import { Controller, Get, Param } from '@nestjs/common';
import { z } from 'zod';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
