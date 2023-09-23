import { ProxyModule } from '@app/common/proxy';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    ConfigModule.forRoot(),
    ProxyModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
