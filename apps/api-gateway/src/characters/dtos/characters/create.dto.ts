import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsString, IsDefined, MinLength, MaxLength } from 'class-validator';

export class CreateDto {
  @ApiProperty({
    example: 'Isaak',
    nullable: false,
    description: 'Character name',
  })
  @IsString()
  @IsDefined()
  @MinLength(4)
  @MaxLength(12)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;
}
