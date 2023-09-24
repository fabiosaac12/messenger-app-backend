import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SetClientProxy } from '@app/common/proxy';
import { Auth, GetUser } from '@app/common/decorators';
import { RequestUser } from '@app/common/models';
import { CreateDto } from './dtos/characters';
import { CharacterMessages } from '@app/common/enums';

@ApiTags('Characters')
@Controller('characters')
export class CharactersController {
  constructor(private readonly clientProxy: SetClientProxy) {}

  private charactersClientProxy = this.clientProxy.characters();

  @Post()
  @ApiOperation({ summary: 'Create a new character' })
  @Auth()
  create(@Body() entry: CreateDto, @GetUser() user: RequestUser) {
    return this.charactersClientProxy.send(CharacterMessages.create, {
      entry,
      user,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all user characters' })
  @Auth()
  getAll(@GetUser() user: RequestUser) {
    return this.charactersClientProxy.send(CharacterMessages.getAll, {
      user,
    });
  }

  @Get(':characterId')
  @ApiOperation({ summary: 'Get character by ID' })
  @Auth()
  getById(
    @Param('characterId') characterId: string,
    @GetUser() user: RequestUser,
  ) {
    return this.charactersClientProxy.send(CharacterMessages.getById, {
      user,
      entry: {
        characterId,
      },
    });
  }

  @Delete(':characterId')
  @ApiOperation({ summary: 'Delete character by ID' })
  @Auth()
  delete(
    @Param('characterId') characterId: string,
    @GetUser() user: RequestUser,
  ) {
    return this.charactersClientProxy.send(CharacterMessages.delete, {
      user,
      entry: {
        characterId,
      },
    });
  }
}
