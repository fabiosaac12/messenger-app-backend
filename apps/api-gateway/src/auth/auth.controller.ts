import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetClientProxy } from '@app/common/proxy';
import { AuthMessages } from '@app/common/enums';
import { Auth, GetUser } from '@app/common/decorators';
import { RegisterDto, LoginDto } from './dtos/auth';
import { RequestUser } from '@app/common/models';

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

  @Post('login')
  @ApiOperation({ summary: 'Login' })
  login(@Body() entry: LoginDto) {
    return this.authClientProxy.send(AuthMessages.login, {
      entry,
    });
  }

  @Get('profile')
  @Auth()
  @ApiOperation({ summary: 'Profile' })
  profile(@GetUser() user: RequestUser) {
    return user;
  }
}
