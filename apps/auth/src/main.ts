import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Queues } from '@app/common/enums';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URI],
      queue: `${Queues.auth}_${process.env.ENVIRONMENT}`,
    },
  });

  await app.listen();

  Logger.log('Auth microservice is running');
}

bootstrap();
