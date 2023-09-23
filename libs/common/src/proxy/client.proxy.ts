import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { Queues } from '@app/common/enums';
import { EnvironmentVariables } from '../models/EnvironmentVariables';

@Injectable()
export class SetClientProxy {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables>,
  ) {}

  auth(): ClientProxy {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: this.configService.get('AMQP_URI'),
        queue: `${Queues.auth}_${this.configService.get('ENVIRONMENT')}`,
      },
    });
  }
}
