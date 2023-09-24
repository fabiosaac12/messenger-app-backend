import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { MongoDataService } from '../../services/data-services/mongo-data-service';
import {
  CreateCharactersDto,
  DeleteCharactersDto,
  GetAllCharactersDto,
  GetByIdCharactersDto,
} from '../../entities';

@Injectable()
export class CharactersUseCases {
  constructor(
    private dataServices: MongoDataService,
    private jwtService: JwtService,
  ) {}

  async create(
    user: CreateCharactersDto['user'],
    entry: CreateCharactersDto['entry'],
  ) {
    try {
      const newCharacter = await this.dataServices.characters.create({
        user: user._id,
        ...entry,
      });

      return newCharacter;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getAll(user: GetAllCharactersDto['user']) {
    try {
      const characters = await this.dataServices.characters.getAll(user._id);

      return characters;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async getById(
    user: GetByIdCharactersDto['user'],
    entry: GetByIdCharactersDto['entry'],
  ) {
    try {
      const character = await this.dataServices.characters.getById(
        user._id,
        entry.characterId,
      );

      if (!character) {
        throw new HttpException('character_not_found', HttpStatus.NOT_FOUND);
      }

      return character;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async delete(
    user: DeleteCharactersDto['user'],
    entry: DeleteCharactersDto['entry'],
  ) {
    try {
      const character = await this.dataServices.characters.delete(
        user._id,
        entry.characterId,
      );

      if (!character) {
        throw new HttpException('character_not_found', HttpStatus.NOT_FOUND);
      }

      return character;
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
