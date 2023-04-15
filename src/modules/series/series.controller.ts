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
import { PaginatedSeriesDto, SeriesDto } from './series.dto';
import { SeriesService } from './series.service';
import { AccessTokenGuard } from '../auth/auth.guard';

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

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiQuery({
    name: 'seriesIds',
    type: [String],
    required: true,
  })
  deleteSeries(
    @Query('seriesIds', ParseArrayPipe) seriesIds: string[],
  ): Promise<void> {
    return this.seriesService.deleteSeries({ seriesIds });
  }
}
