import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CharacterMessages } from '@app/common/enums';
import {
  CreateCharactersDto,
  DeleteCharactersDto,
  GetAllCharactersDto,
  GetByIdCharactersDto,
} from '../entities';
import { CharactersUseCases } from '../use-cases';

@Controller()
export class CharactersController {
  constructor(private readonly charactersUseCases: CharactersUseCases) {}

  @MessagePattern(CharacterMessages.create)
  create(@Payload() { entry, user }: CreateCharactersDto) {
    return this.charactersUseCases.create(user, entry);
  }

  @MessagePattern(CharacterMessages.getAll)
  getAll(@Payload() { user }: GetAllCharactersDto) {
    return this.charactersUseCases.getAll(user);
  }

  @MessagePattern(CharacterMessages.getById)
  getById(@Payload() { user, entry }: GetByIdCharactersDto) {
    return this.charactersUseCases.getById(user, entry);
  }

  @MessagePattern(CharacterMessages.delete)
  delete(@Payload() { user, entry }: DeleteCharactersDto) {
    return this.charactersUseCases.delete(user, entry);
  }
}
