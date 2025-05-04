import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserPublisher } from './publishers/user.publisher';
import { User } from './entities/user.entity';
import { UserEventTypeEnum } from './enum/event-types.enum';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userPublisher: UserPublisher,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const savedUser = this.userRepo.create(createUserDto);

    await this.userPublisher.publishUserEvent(
      UserEventTypeEnum.CREATED,
      createUserDto,
    );

    return savedUser;
  }

  async emailExists(email: CreateUserDto['email']): Promise<boolean> {
    try {
      const existingUser = await this.findByEmail(email);
      return !!existingUser;
    } catch (error) {
      return false;
    }
  }

  async documentNumberExists(
    documentNumber: CreateUserDto['documentNumber'],
  ): Promise<boolean> {
    try {
      const existingUser = await this.findByDocumentNumber(documentNumber);
      return !!existingUser;
    } catch (error) {
      return false;
    }
  }

  async findByEmail(email: CreateUserDto['email']): Promise<User | null> {
    return await this.userRepo.findOne({ where: { email: email } });
  }

  async findByDocumentNumber(
    documentNumber: CreateUserDto['documentNumber'],
  ): Promise<User | null> {
    return await this.userRepo.findOne({
      where: { documentNumber: documentNumber },
    });
  }
}
