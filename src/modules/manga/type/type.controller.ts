import {
  Controller,
  Delete,
  Get,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginatedTypeDto, TypeDto } from './type.dto';
import { TypeService } from './type.service';
import { AccessTokenGuard } from '../../auth/auth.guard';

@Controller('types')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @ApiQuery({
    name: 'withAlbums',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @Get()
  getTypes(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('name') name: string,
    @Query('withAlbums') withAlbums: string,
  ): Promise<PaginatedTypeDto> {
    return this.typeService.getTypes({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
      withAlbums: withAlbums == 'true',
    });
  }

  @Post()
  createType(type: TypeDto): Promise<TypeDto> {
    return this.typeService.createType(type);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiQuery({
    name: 'typeIds',
    type: [String],
    required: true,
  })
  deleteTags(
    @Query('typeIds', ParseArrayPipe) typeIds: string[],
  ): Promise<void> {
    return this.typeService.deleteTypes({ typeIds });
  }
}
