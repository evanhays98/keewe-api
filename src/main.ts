import * as passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './AppModule';
import * as session from 'express-session';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();

  app
    .use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        rolling: true,
      }),
    )
    .enableCors();
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(parseInt(process.env.APP_PORT, 10) || 3000);
}

bootstrap().then(() => console.log('Application started'));
