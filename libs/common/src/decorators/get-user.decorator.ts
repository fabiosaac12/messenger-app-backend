import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { RequestUser } from '../models/auth/request-user';

export const GetUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<{ user: RequestUser }>();

  if (!user) throw new UnauthorizedException('user_not_found_request');

  return user;
});
