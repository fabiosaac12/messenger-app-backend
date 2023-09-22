import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthMessages } from '@app/common/enums';
import { LoginEntry, RegisterEntry } from '../entities';
import { AuthUseCases } from '../use-cases';

@Controller()
export class AuthController {
  constructor(private readonly authUseCases: AuthUseCases) {}

  @MessagePattern(AuthMessages.register)
  register(@Payload() { entry }: { entry: RegisterEntry }) {
    return this.authUseCases.register(entry);
  }

  @MessagePattern(AuthMessages.login)
  login(@Payload() { entry }: { entry: LoginEntry }) {
    return this.authUseCases.login(entry);
  }
}
