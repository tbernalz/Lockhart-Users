import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { rabbitMQConfig } from './config/rabbitmq.config';
import { DatabaseModule } from './database/database.module';
import { RabbitMQSharedModule } from './rabbitmq/rabbitmq.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [rabbitMQConfig] }),
    DatabaseModule,
    RabbitMQSharedModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
