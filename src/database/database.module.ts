import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import config from '../config/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const envConfig =
          configService.get<ConfigType<typeof config>>('config');

        if (!envConfig) {
          throw new Error('Missing configuration for "config"');
        }

        return {
          type: 'postgres',
          host: envConfig.database.host,
          port: envConfig.database.port,
          username: envConfig.database.user,
          password: envConfig.database.password,
          database: envConfig.database.name,
          ssl:
            envConfig.database.ssl === 'true'
              ? { rejectUnauthorized: false }
              : false,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
          autoLoadEntities: true,
          namingStrategy: new SnakeNamingStrategy(),
          logging:
            envConfig.database.logging === 'true' ? ['error', 'warn'] : false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
