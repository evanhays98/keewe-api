import { Module } from '@nestjs/common';
import { AppController } from './AppController';
import { AppService } from './AppService';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/AuthModule';
import { ConfigModule } from '@nestjs/config';
import { TransactionModule } from './transactions/TransactionModule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: ['../src/**/*Entity.ts'],
      synchronize: false,
      autoLoadEntities: true,
    }),
    AuthModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
