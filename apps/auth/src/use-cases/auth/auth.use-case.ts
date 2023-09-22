import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { MongoDataService } from '../../services/data-services/mongo-data-service';
import { LoginEntry, RegisterEntry } from '../../entities';
import { encrypt } from '@app/common/helpers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthUseCases {
  constructor(
    private dataServices: MongoDataService,
    private jwtService: JwtService,
  ) {}

  async register(entry: RegisterEntry) {
    try {
      const newUser = await this.dataServices.auth.createUser({
        ...entry,
        password: await encrypt(entry.password),
      });

      return newUser;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async login(entry: LoginEntry) {
    try {
      const user = await this.dataServices.auth.getUserByUsername(
        entry.username,
      );

      if (!user) {
        throw new HttpException('failed_login', HttpStatus.UNAUTHORIZED);
      }

      return {
        user,
        token: await this.jwtService.signAsync(user.toObject(), {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any): never {
    console.log(error);

    if (
      error instanceof HttpException ||
      (typeof error?.status === 'number' && error?.message)
    ) {
      throw new RpcException(error);
    }

    throw new RpcException(
      error instanceof Error
        ? { message: error.message, name: error.name }
        : new InternalServerErrorException(
            'Internal server error. Check server logs',
          ),
    );
  }
}
