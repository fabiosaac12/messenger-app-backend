import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentVariablesValidationSchema } from '@app/common/validations';
import { EnvironmentVariables } from '@app/common/models';
import { DataServicesModule } from './services';
import { CharactersUseCasesModule } from './use-cases';
import { CharactersController } from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: EnvironmentVariablesValidationSchema,
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
    CharactersUseCasesModule,
  ],
  controllers: [CharactersController],
  providers: [],
})
export class AppModule {}
