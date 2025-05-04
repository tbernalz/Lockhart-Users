import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { UserService } from '../user.service';
import { CreateUserEventDto } from '../dto/create-user-event.dto';

@Injectable()
export class UserSuscriber {
  private readonly logger = new Logger(UserSuscriber.name);

  constructor(private readonly userService: UserService) {}

  @RabbitSubscribe({
    exchange: 'user_exchange',
    routingKey: 'user.created',
    queue: 'user_creation_queue',
    queueOptions: {
      durable: true,
      deadLetterExchange: 'user_dlx',
      deadLetterRoutingKey: 'user.failed',
    },
    allowNonJsonMessages: false,
  })
  async processCreateUser(createUserEventDto: CreateUserEventDto) {
    try {
      const user = await this.userService.create(createUserEventDto.payload);
      return {
        success: true,
        data: user,
        eventId: createUserEventDto.eventId,
      };
    } catch (error) {
      this.logger.error(`User creation failed`, error.stack);
      // throw error; // Let the error handler deal with it
      return {
        success: false,
        error: error.message,
        eventId: createUserEventDto.eventId,
      };
    }
  }
}
