import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        { name: 'user_exchange', type: 'topic' },
        { name: 'user_dlx', type: 'topic' }, // Dead letter exchange
      ],
      uri: process.env.RABBITMQ_URI || '',
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitMQSharedModule {}
