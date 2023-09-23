import { Model } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UserModel } from '@app/common/schemas';
import { RegisterDto } from '../entities';

export class AuthRepository {
  constructor(private readonly userModel: Model<UserModel>) {}

  async createUser(entry: RegisterDto['entry']) {
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
    const user = await this.userModel.findOne(
      { username },
      { _id: 1, username: 1, email: 1, lastAccess: 1, password: 1 },
    );

    return user;
  }

  async updateUserLastAccess(id: string) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      {
        lastAccess: new Date().getTime(),
      },
      {
        new: true,
        projection: { _id: 1, username: 1, email: 1, lastAccess: 1 },
      },
    );

    return user;
  }
}
