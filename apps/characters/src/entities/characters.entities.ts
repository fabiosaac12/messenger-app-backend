import { RequestUser } from '@app/common/models';

export interface CreateCharactersDto {
  user: RequestUser;
  entry: {
    name: string;
  };
}

export interface GetAllCharactersDto {
  user: RequestUser;
}

export interface GetByIdCharactersDto {
  user: RequestUser;
  entry: {
    characterId: string;
  };
}

export interface DeleteCharactersDto {
  user: RequestUser;
  entry: {
    characterId: string;
  };
}
