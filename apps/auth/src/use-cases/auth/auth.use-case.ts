import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, encrypt } from '@app/common/helpers';
import { MongoDataService } from '../../services/data-services/mongo-data-service';
import { LoginDto, RefreshDto, RegisterDto } from '../../entities';

@Injectable()
export class AuthUseCases {
  constructor(
    private dataServices: MongoDataService,
    private jwtService: JwtService,
  ) {}

  async register(entry: RegisterDto['entry']) {
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

  async login(entry: LoginDto['entry']) {
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
        token: await this.jwtService.signAsync(user),
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async refresh(user: RefreshDto['user']) {
    try {
      const updatedUser = await this.dataServices.auth.updateUserLastAccess(
        user._id,
      );

      return {
        user: updatedUser,
        token: await this.jwtService.signAsync(updatedUser.toObject()),
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
