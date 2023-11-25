import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';
import * as controller from './controllers';
import * as services from './services';

@Module({
  imports: [TypeOrmModule.forFeature([...Object.values(entities)])],
  controllers: [...Object.values(controller)],
  providers: [...Object.values(services)],
})
export class TransactionModule {}
