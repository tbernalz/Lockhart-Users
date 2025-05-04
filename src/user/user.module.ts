import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserPublisher } from './publishers/user.publisher';
import { UserSuscriber } from './consumers/user.suscriber';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { RabbitMQSharedModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RabbitMQSharedModule],
  controllers: [UserController],
  providers: [UserService, UserPublisher, UserSuscriber],
})
export class UserModule {}
