import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { PaginatedSeriesDto, SeriesDto } from './series.dto';
import { SeriesService } from './series.service';

@Controller('series')
export class SeriesController {
  constructor(private readonly seriesService: SeriesService) {}

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
  getSeries(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('name') name: string,
    @Query('withAlbums') withAlbums: string,
  ): Promise<PaginatedSeriesDto> {
    return this.seriesService.getSeries({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
      withAlbums: withAlbums == 'true',
    });
  }

  @Post()
  createSeries(@Body() series: SeriesDto): Promise<SeriesDto> {
    try {
      return this.seriesService.createSeries(series);
    } catch (e) {}
  }
}
