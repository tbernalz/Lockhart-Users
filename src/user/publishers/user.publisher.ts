import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UserRequestEventDto } from '../dto/user-request-event.dto';

@Injectable()
export class UserPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishUserEvent(
    exchangeName: string,
    routingKey: string,
    message: UserRequestEventDto,
  ): Promise<void> {
    await this.amqpConnection.publish(exchangeName, routingKey, message);
    console.log(
      `Published message ${JSON.stringify(message)}. Sent to exchange ${exchangeName} and routingKey: ${routingKey}`,
    );
  }
}
