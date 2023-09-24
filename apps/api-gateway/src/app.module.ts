import { ProxyModule } from '@app/common/proxy';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentVariables } from '@app/common/models';
import { EnvironmentVariablesValidationSchema } from '@app/common/validations';
import { AuthController } from './auth';
import { CharactersController } from './characters';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: EnvironmentVariablesValidationSchema,
    }),
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
  controllers: [AuthController, CharactersController],
  providers: [],
})
export class AppModule {}
