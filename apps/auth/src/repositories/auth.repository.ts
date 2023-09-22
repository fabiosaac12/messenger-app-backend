import { Model } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserModel } from '@app/common/models';
import { RegisterEntry } from '../entities';

export class AuthRepository {
  constructor(private readonly userModel: Model<UserModel>) {}

  async createUser(entry: RegisterEntry) {
    try {
      const newUser = await new this.userModel({
        ...entry,
      }).save();

      return newUser;
    } catch (error) {
      if (error.code === 11000)
        throw new HttpException(
          `duplicated_user_${Object.keys(error.keyValue)[0]}`,
          HttpStatus.CONFLICT,
        );
    }
  }

  async getUserByUsername(username: string) {
    const user = await this.userModel.findOne({ username });

    return user;
  }
}
