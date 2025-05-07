import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ_CONFIG } from 'src/config/rabbitmq.constants';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        { name: RABBITMQ_CONFIG.exchanges.publisher.user, type: 'topic' },
        { name: RABBITMQ_CONFIG.exchanges.consumer.user, type: 'topic' },
      ],
      uri: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQSharedModule {}
