import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RABBITMQ_CONFIG } from 'src/config/rabbitmq.constants';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        { name: RABBITMQ_CONFIG.exchanges.publisher.user, type: 'topic' },
      ],
      uri: process.env.RABBITMQ_URI || '',
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQSharedModule {}
