import { Module } from '@nestjs/common';
import { MongoDataServiceModule } from './mongo-data-service';

@Module({
  imports: [MongoDataServiceModule],
  exports: [MongoDataServiceModule],
})
export class DataServicesModule {}
