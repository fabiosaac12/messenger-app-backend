import { ProxyModule } from '@app/common/proxy';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EnvValidationSchema } from '@app/common/validations/env.validation';
import { AuthController } from './auth';
import { EnvironmentVariables } from '@app/common/models/EnvironmentVariables';

@Module({
  imports: [
    ConfigModule.forRoot({ validationSchema: EnvValidationSchema }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
    ProxyModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
