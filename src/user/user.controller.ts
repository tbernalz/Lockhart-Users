import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('check-email')
  async checkEmail(@Query() email: CreateUserDto['email']) {
    const emailExists = await this.userService.emailExists(email);

    return {
      emailExists,
      message: emailExists ? 'Email already in use' : 'Email available',
    };
  }
}
