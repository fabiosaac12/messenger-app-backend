import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CharacterModel, CharacterSchema } from '@app/common/schemas';
import { MongoDataService } from './mongo-data-service.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CharacterModel.name,
        schema: CharacterSchema,
      },
    ]),
  ],
  providers: [MongoDataService],
  exports: [MongoDataService],
})
export class MongoDataServiceModule {}
