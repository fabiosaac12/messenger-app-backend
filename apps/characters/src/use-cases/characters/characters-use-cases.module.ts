import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CharactersUseCases } from './characters.use-cases';
import { DataServicesModule } from '../../services';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DataServicesModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  providers: [CharactersUseCases],
  exports: [CharactersUseCases],
})
export class CharactersUseCasesModule {}
