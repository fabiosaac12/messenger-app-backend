import { Model, SaveOptions } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CharacterModel } from '@app/common/schemas';
import { CreateCharacter } from '../models';

export class CharactersRepository {
  constructor(private readonly characterModel: Model<CharacterModel>) {}

  async create(character: CreateCharacter, options?: SaveOptions) {
    try {
      const newCharacter = await new this.characterModel(character).save(
        options,
      );

      return newCharacter;
    } catch (error) {
      if (error.code === 11000)
        throw new HttpException(
          `duplicated_character_${Object.keys(error.keyValue)[0]}`,
          HttpStatus.CONFLICT,
        );
    }
  }

  async getAll(userId: string) {
    const characters = await this.characterModel.find({
      user: userId,
      deleted: false,
    });

    return characters;
  }

  async getById(userId: string, characterId: string) {
    const character = await this.characterModel.findOne({
      _id: characterId,
      user: userId,
      deleted: false,
    });

    return character;
  }

  async delete(userId: string, characterId: string) {
    const character = await this.characterModel.findOneAndUpdate(
      {
        _id: characterId,
        user: userId,
        deleted: false,
      },
      {
        $set: {
          deleted: true,
          deletedAt: new Date().getTime(),
        },
      },
    );

    return character;
  }
}
