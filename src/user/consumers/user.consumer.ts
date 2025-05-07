import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ_CONFIG } from '../../config/rabbitmq.constants';
import { UserService } from '../user.service';

@Injectable()
export class UserConsumer {
  private readonly logger = new Logger(UserConsumer.name);

  private static readonly rabbitmqConfig = RABBITMQ_CONFIG;

  constructor(private readonly userService: UserService) {}

  @RabbitSubscribe({
    exchange: UserConsumer.rabbitmqConfig.exchanges.consumer.user,
    routingKey: UserConsumer.rabbitmqConfig.routingKeys.userRequest,
    queue: UserConsumer.rabbitmqConfig.queues.userRequest,
    queueOptions: {
      durable: true,
      deadLetterExchange: 'users_request_dlx',
      deadLetterRoutingKey: 'users_request.failed',
    },
    createQueueIfNotExists: true,
    allowNonJsonMessages: false,
  })
  async handleUserRequest(
    message: Record<string, any>,
    raw: Record<string, any>,
  ): Promise<void> {
    const headers = raw.properties?.headers || {};

    this.logger.log(
      `Incoming message to exchange: ${UserConsumer.rabbitmqConfig.exchanges.consumer.user}, queue: ${JSON.stringify(UserConsumer.rabbitmqConfig.queues.userRequest)}, routingKey: ${UserConsumer.rabbitmqConfig.routingKeys.userRequest}`,
    );

    const userId = headers?.userId;
    const operation = headers?.eventType;

    this.logger.log(
      `Received user request for userId: ${userId}, operation: ${operation}, message: ${JSON.stringify(message)}, headers: ${JSON.stringify(headers)}`,
    );

    await this.userService.handleUserEvents(userId, operation, message);
  }
}
