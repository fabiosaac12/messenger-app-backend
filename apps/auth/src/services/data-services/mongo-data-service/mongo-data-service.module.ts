import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '@app/common/schemas';
import { MongoDataService } from './mongo-data-service.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserModel.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [MongoDataService],
  exports: [MongoDataService],
})
export class MongoDataServiceModule {}
