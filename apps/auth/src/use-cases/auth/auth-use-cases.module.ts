import { Module } from '@nestjs/common';
import { AuthUseCases } from './auth.use-case';
import { DataServicesModule } from '../../services';

@Module({
  imports: [DataServicesModule],
  providers: [AuthUseCases],
  exports: [AuthUseCases],
})
export class AuthUseCasesModule {}
