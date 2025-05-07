import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UserRequestEventDto } from '../dto/user-request-event.dto';

@Injectable()
export class UserPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishUserEvent(
    exchangeName: string,
    routingKey: string,
    message: UserRequestEventDto['payload'],
    headers: UserRequestEventDto['headers'],
  ): Promise<void> {
    await this.amqpConnection.publish(exchangeName, routingKey, message, {
      headers,
    });

    console.log(
      `Published message: ${JSON.stringify(message)}. Headers: ${JSON.stringify(headers)} Sent to exchange: ${exchangeName} and routingKey: ${routingKey}`,
    );
  }
}
