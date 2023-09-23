import { RequestUser } from '@app/common/models';

export interface RegisterDto {
  entry: {
    username: string;
    email: string;
    password: string;
  };
}

export interface LoginDto {
  entry: {
    username: string;
    password: string;
  };
}

export interface RefreshDto {
  user: RequestUser;
  token: string;
}
