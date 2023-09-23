import { Model } from 'mongoose';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserModel } from '@app/common/schemas';
import { AuthRepository } from '../../../repositories';

@Injectable()
export class MongoDataService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserModel>,
  ) {}

  auth: AuthRepository;

  onApplicationBootstrap() {
    this.auth = new AuthRepository(this.userModel);
  }
}
