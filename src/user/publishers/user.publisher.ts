import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UserEventTypeEnum } from '../enum/event-types.enum';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UserPublisher {
  private readonly exchangeName = 'user_exchange';
  private readonly routingKeyPrefix = 'user';

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishUserEvent(
    eventType: UserEventTypeEnum,
    createUserDto: CreateUserDto,
  ): Promise<void> {
    await this.amqpConnection.publish(
      this.exchangeName,
      `${this.routingKeyPrefix}.${eventType.toLowerCase()}`,
      {
        payload: createUserDto,
        headers: {
          eventType,
          timestamp: new Date().toISOString(),
        },
      },
    );
  }
}
