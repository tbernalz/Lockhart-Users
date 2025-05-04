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
