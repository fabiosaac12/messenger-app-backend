import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DataServicesModule } from './services';
import { AuthUseCasesModule } from './use-cases';
import { AuthController } from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB, {
      directConnection:
        process.env.MONGODB_DIRECT_CONNECTION === 'true' ? true : false,
    }),
    DataServicesModule,
    AuthUseCasesModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
