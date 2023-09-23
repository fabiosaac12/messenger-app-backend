import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthMessages } from '@app/common/enums';
import { LoginDto, RefreshDto, RegisterDto } from '../entities';
import { AuthUseCases } from '../use-cases';

@Controller()
export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) {}

  @MessagePattern(AuthMessages.register)
  register(@Payload() { entry }: RegisterDto) {
    return this.authUseCases.register(entry);
  }

  @MessagePattern(AuthMessages.login)
  login(@Payload() { entry }: LoginDto) {
    return this.authUseCases.login(entry);
  }

  @MessagePattern(AuthMessages.refresh)
  refresh(@Payload() { user }: RefreshDto) {
    return this.authUseCases.refresh(user);
  }
}
