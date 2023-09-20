import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MongoDataService } from '../../services/data-services/mongo-data-service';
import { RegisterEntry } from '../../entities';

@Injectable()
export class AuthUseCases {
  constructor(private dataServices: MongoDataService) {}

  async create(entry: RegisterEntry) {
    try {
      const newUser = await this.dataServices.auth.register(entry);

      return newUser;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    if (
      error instanceof HttpException ||
      (typeof error?.status === 'number' && error?.message)
    ) {
      throw new RpcException(error);
    }

    if (error.code === 11000)
      throw new RpcException(
        new HttpException('Duplicated user', HttpStatus.CONFLICT),
      );

    throw new RpcException(
      error instanceof Error
        ? { message: error.message, name: error.name }
        : new InternalServerErrorException(
            'Internal server error. Check server logs',
          ),
    );
  }
}
