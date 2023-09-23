import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { comparePassword, encrypt } from '@app/common/helpers';
import { EnvironmentVariables } from '@app/common/models/EnvironmentVariables';
import { MongoDataService } from '../../services/data-services/mongo-data-service';
import { LoginEntry, RegisterEntry } from '../../entities';

@Injectable()
export class AuthUseCases {
  constructor(
    private configService: ConfigService<EnvironmentVariables>,
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
      const _user = await this.dataServices.auth.getUserByUsername(
        entry.username,
      );

      const { password, ...user } = _user.toObject();

      if (!user || !(await comparePassword(entry.password, password))) {
        throw new HttpException('failed_login', HttpStatus.UNAUTHORIZED);
      }

      return {
        user,
        token: await this.jwtService.signAsync(user, {
          expiresIn: this.configService.get('JWT_EXPIRES_IN'),
        }),
      };
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

    throw new RpcException(
      error instanceof Error
        ? { message: error.message, name: error.name }
        : new InternalServerErrorException(
            'Internal server error. Check server logs',
          ),
    );
  }
}
