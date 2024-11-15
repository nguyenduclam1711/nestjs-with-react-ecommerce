import {
  Body,
  Controller,
  Get,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.users({});
  }

  @Post()
  async createUser(
    @Body()
    data: any,
  ) {
    try {
      return await this.userService.createUser(data);
    } catch (error) {
      throw new UnprocessableEntityException(error.message);
    }
  }
}
