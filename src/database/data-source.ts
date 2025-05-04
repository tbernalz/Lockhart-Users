import { Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import config from '../config/config';

ConfigModule.forRoot({
  load: [config],
  isGlobal: true,
});

const envconfig = config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: envconfig.database.host,
  port: envconfig.database.port,
  database: envconfig.database.name,
  username: envconfig.database.user,
  password: envconfig.database.password,
  entities: ['../**/*.entity{.ts,.js}'],
  migrations: ['../database/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: envconfig.database.logging === 'true' ? ['error', 'warn'] : false,
  namingStrategy: new SnakeNamingStrategy(),
  ssl:
    envconfig.database.ssl === 'true' ? { rejectUnauthorized: false } : false,
});

async function initializeDataSource() {
  try {
    await AppDataSource.initialize();
    Logger.log('Data Source has been initialized!');
  } catch (err) {
    Logger.error('Error during Data Source initialization', err);
  }
}

initializeDataSource();
