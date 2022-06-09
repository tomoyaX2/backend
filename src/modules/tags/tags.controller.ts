import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { PaginatedTagsDto, TagsDto } from './tags.dto';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiQuery({
    name: 'withAlbums',
    type: String,
    required: false,
  })
  @Get()
  getTags(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('name') name: string,
    @Query('withAlbums') withAlbums: string,
  ): Promise<PaginatedTagsDto> {
    return this.tagsService.getTags({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
      withAlbums: withAlbums == 'true',
    });
  }

  @Post()
  saveTag(@Body() tag: TagsDto) {
    return this.tagsService.saveTag(tag);
  }
}
