import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../guards';

export const Auth = () =>
  applyDecorators(UseGuards(AuthGuard), ApiBearerAuth());
