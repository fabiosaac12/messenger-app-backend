import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthUseCases } from './auth.use-case';
import { DataServicesModule } from '../../services';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DataServicesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [AuthUseCases],
  exports: [AuthUseCases],
})
export class AuthUseCasesModule {}
