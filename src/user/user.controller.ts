import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('verify')
  async verify(@Body() createUserDto: CreateUserDto) {
    return this.userService.verify(createUserDto);
  }

  @Get('check-email')
  async checkEmail(@Query() email: CreateUserDto['email']) {
    const emailExists = await this.userService.emailExists(email);

    return {
      emailExists,
      message: emailExists ? 'Email already in use' : 'Email available',
    };
  }

  @Get('check-document-number')
  async checkDocumentNumber(
    @Query() documentNumber: CreateUserDto['documentNumber'],
  ) {
    const documentNumberExists =
      await this.userService.documentNumberExists(documentNumber);

    return {
      documentNumberExists,
      message: documentNumberExists
        ? 'Document number already in use'
        : 'Document number available',
    };
  }
}
