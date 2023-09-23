import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvValidationSchema } from '@app/common/validations/env.validation';
import { DataServicesModule } from './services';
import { AuthUseCasesModule } from './use-cases';
import { AuthController } from './controllers';
import { EnvironmentVariables } from '@app/common/models/EnvironmentVariables';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvValidationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables>) => ({
        uri: configService.get('MONGODB_URI'),
        directConnection: configService.get('MONGODB_DIRECT_CONNECTION'),
      }),
    }),
    DataServicesModule,
    AuthUseCasesModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
