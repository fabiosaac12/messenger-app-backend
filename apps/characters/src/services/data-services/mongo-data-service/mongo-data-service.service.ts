import { Model } from 'mongoose';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CharacterModel } from '@app/common/schemas';
import { CharactersRepository } from '../../../repositories';

@Injectable()
export class MongoDataService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(CharacterModel.name)
    private characterModel: Model<CharacterModel>,
  ) {}

  characters: CharactersRepository;

  onApplicationBootstrap() {
    this.characters = new CharactersRepository(this.characterModel);
  }
}
