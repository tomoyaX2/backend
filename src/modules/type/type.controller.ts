import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { PaginatedTypeDto, TypeDto } from './type.dto';
import { TypeService } from './type.service';

@Controller('types')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @ApiQuery({
    name: 'withAlbums',
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
}
