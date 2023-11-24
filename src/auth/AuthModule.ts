import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as controllers from './controllers';
import * as services from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/UserEntity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_AUTH_SECRET,
      signOptions: { expiresIn: '3333333s' },
    }),
  ],
  controllers: [...Object.values(controllers)],
  providers: [TypeOrmModule, ...Object.values(services)],
})
export class AuthModule {}
