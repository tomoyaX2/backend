import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { HitomiFields } from 'src/shared/enums/HitomiFields';
import { DeleteResult } from 'typeorm';
import { AlbumDto, PaginatedAlbumDto, SearchDto } from './album.dto';
import { AlbumService } from './album.service';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'perPage',
    type: Number,
    required: false,
  })
  @Get()
  getAlbums(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ): Promise<PaginatedAlbumDto> {
    return this.albumService.getAlbums({
      page: parseInt(page),
      perPage: parseInt(perPage),
    });
  }

  @Get(':albumId')
  getAlbumById(@Param('albumId') albumId: string): Promise<AlbumDto> {
    return this.albumService.getAlbumById(albumId);
  }

  @Post('search')
  searchAlbums(@Body() data: SearchDto): Promise<PaginatedAlbumDto> {
    return this.albumService.searchAlbums({
      page: parseInt(data.page),
      perPage: parseInt(data.perPage),
      title: data.title,
      authors: data.authors,
      series: data.series,
      language: data.languages,
      group: data.groups,
      tags: data.tags,
      type: data.types,
      sortBy: data.sortBy,
    });
  }

  @Post('find-duplicate')
  findDuplicate(@Body() data: Record<string, string>): Promise<boolean> {
    return this.albumService.getAlbumForScrapperFilter(data);
  }

  @Post('scrapper-album')
  saveScrapperData(
    @Body()
    data: {
      albumData: Record<
        HitomiFields | 'downloadPath' | 'totalImages' | 'preview',
        any
      >;
      currentPageIndex: number;
      albumIndex: number;
      albumPath: string;
    },
  ): Promise<string> {
    return this.albumService.generateAlbum(data);
  }

  @Post('scrapper-album-images')
  saveScrapperImagesData(
    @Body()
    data: {
      albumId: string;
      images: { url: string; width: number; height: number }[];
    },
  ): Promise<void> {
    return this.albumService.updateAlbumImagesById(data);
  }

  @Delete(':albumId')
  deleteAlbumById(@Param('albumId') albumId: string): Promise<DeleteResult> {
    return this.albumService.deleteAlbumById(albumId);
  }
}
