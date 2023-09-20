import { Module } from '@nestjs/common';
import { ProxyModule } from '@app/common/proxy';
import { AuthController } from './auth';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ProxyModule],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
