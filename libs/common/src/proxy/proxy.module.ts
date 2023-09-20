import { Module } from '@nestjs/common';
import { SetClientProxy } from './client.proxy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [SetClientProxy],
  exports: [SetClientProxy],
})
export class ProxyModule {}
