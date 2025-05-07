import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
  private readonly logger = new Logger(UserService.name);
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

  async activateFull(user: User): Promise<User> {
    user.Active = true;
    user.GovCarpetaVerified = true;
    return await this.userRepo.save(user);
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

  async handleUserEvents(
    userId: UserRequestEventDto['headers']['userId'],
    operation: UserRequestEventDto['headers']['eventType'],
    message: UserRequestEventDto['payload'],
  ): Promise<void> {
    try {
      switch (operation) {
        case UserEventTypeEnum.CREATE:
          await this.processUserActivation(message as CreateUserDto['email']);
          break;

        default:
          throw new Error(`Unsupported operation: ${operation}`);
      }
    } catch (error) {
      this.logger.error(
        `Message processing in handleUserRequest failed: ${error.message}`,
        error.stack,
      );
    }
  }

  async processUserActivation(email: CreateUserDto['email']): Promise<void> {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      await this.activateFull(user);

      const message: UserRequestEventDto['payload'] = {
        documentNumber: user.documentNumber,
      };

      const headers: UserRequestEventDto['headers'] = {
        userId: '',
        eventType: UserEventTypeEnum.CREATE,
        timestamp: new Date().toISOString(),
      };

      await this.userPublisher.publishUserEvent(
        UserService.rabbitmqConfig.exchanges.publisher.document,
        UserService.rabbitmqConfig.routingKeys.documentRequest,
        message,
        headers,
      );
    } catch (error) {
      this.logger.error(`User activation failed`, error.stack);
    }
  }
}
