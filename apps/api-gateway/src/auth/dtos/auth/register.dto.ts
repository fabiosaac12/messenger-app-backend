import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsDefined,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'mymail@gmail.com',
    nullable: false,
    description: 'E-mail',
  })
  @IsString()
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({
    example: 'myusername',
    nullable: false,
    description: 'Username',
  })
  @IsString()
  @IsDefined()
  @MinLength(4)
  @MaxLength(12)
  @Transform(({ value }: TransformFnParams) => value?.trim()?.toLowerCase())
  username: string;

  @ApiProperty({
    example: '12345678',
    nullable: false,
    description: 'Password',
  })
  @IsString()
  @IsDefined()
  @MinLength(7)
  @MaxLength(100)
  password: string;
}
