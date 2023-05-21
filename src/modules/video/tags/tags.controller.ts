import {
  Body,
  Controller,
  Delete,
  Get,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginatedTagsDto, TagsDto } from './tags.dto';
import { TagsService } from './tags.service';
import { AccessTokenGuard } from '../../auth/auth.guard';

@Controller('video-tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiQuery({
    name: 'withVideos',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @Get()
  getTags(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('name') name: string,
    @Query('withVideos') withVideos: string,
  ): Promise<PaginatedTagsDto> {
    return this.tagsService.getTags({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
      withVideos: withVideos == 'true',
    });
  }

  @Post()
  saveTag(@Body() tag: TagsDto) {
    return this.tagsService.saveTag(tag);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiQuery({
    name: 'tagIds',
    type: [String],
    required: true,
  })
  deleteTags(@Query('tagIds', ParseArrayPipe) tagIds: string[]): Promise<void> {
    return this.tagsService.deleteTags({ tagIds });
  }
}
