import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetClientProxy } from '@app/common/proxy';
import { AuthMessages } from '@app/common/enums';
import { RegisterDto } from './dtos/auth';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly clientProxy: SetClientProxy) {}

  private authClientProxy = this.clientProxy.auth();

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  register(@Body() entry: RegisterDto) {
    return this.authClientProxy.send(AuthMessages.register, {
      entry,
    });
  }
}
