import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Queues } from '@app/common/enums';

@Injectable()
export class SetClientProxy {
  constructor(private readonly config: ConfigService) {}

  auth(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.config.get('AMQP_URL'),
        queue: `${Queues.auth}_${process.env.ENVIRONMENT}`,
      },
    });
  }
}
