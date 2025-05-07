import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RABBITMQ_CONFIG } from 'src/config/rabbitmq.constants';
import { UserPublisher } from './publishers/user.publisher';
import { User } from './entities/user.entity';
import { UserEventTypeEnum } from './enum/event-types.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRequestEventDto } from './dto/user-request-event.dto';

@Injectable()
export class UserService {
  private static readonly rabbitmqConfig = RABBITMQ_CONFIG;
  constructor(
    private readonly userPublisher: UserPublisher,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async verify(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const newUser = this.userRepo.create(createUserDto);
    await this.userRepo.save(newUser);

    const message: UserRequestEventDto['payload'] = {
      id: newUser.id,
      ...createUserDto,
    };

    const headers: UserRequestEventDto['headers'] = {
      userId: createUserDto.documentNumber,
      eventType: UserEventTypeEnum.VERIFY,
      timestamp: new Date().toISOString(),
    };

    await this.userPublisher.publishUserEvent(
      UserService.rabbitmqConfig.exchanges.publisher.user,
      UserService.rabbitmqConfig.routingKeys.userRequest,
      message,
      headers,
    );

    return newUser;
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
