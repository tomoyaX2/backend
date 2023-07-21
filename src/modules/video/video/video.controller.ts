import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { AccessTokenGuard } from '../../auth/auth.guard';
import {
  VideoDto,
  PaginatedVideoDto,
  RateDto,
  ScrapperDto,
  SearchDto,
} from './video.dto';
import { VideoService } from './video.service';

@Controller('videos')
export class VideoController {
  constructor(private readonly videosService: VideoService) {}

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
  getVideos(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
  ): Promise<PaginatedVideoDto> {
    return this.videosService.getVideos({
      page: parseInt(page),
      perPage: parseInt(perPage),
    });
  }

  @Get(':videoId')
  getVideoById(@Param('videoId') videoId: string): Promise<VideoDto> {
    return this.videosService.getVideoById(videoId);
  }

  @Post('search')
  searchVideos(@Body() data: SearchDto): Promise<PaginatedVideoDto> {
    return this.videosService.search({
      page: data.page,
      perPage: data.perPage,
      title: data.title,
    });
  }

  @Patch(':videoId')
  updateVideo(
    @Body() data: VideoDto,
    @Param('videoId') videoId: string,
  ): Promise<VideoDto> {
    return this.videosService.updateVideo(videoId, data);
  }

  @Post('find-duplicate')
  findDuplicate(@Body() data: Record<string, string>): Promise<boolean> {
    return this.videosService.getVideoForScrapperFilter(data);
  }

  @Get('search-title/:title')
  findByTitle(@Param('title') title: string) {
    return this.videosService.getVideoByTitle(title);
  }

  @Post('scrapper-video')
  saveScrapperData(@Body() scrapperData: ScrapperDto) {
    return this.videosService.generateVideo({ scrapperData });
  }

  @Delete(':videoId')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  deleteAlbumById(@Param('videoId') videoId: string): Promise<DeleteResult> {
    return this.videosService.deleteVideoById(videoId);
  }

  @Get(':videoId/rate')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  getRateAlbum(
    @Param('videoId') videoId: string,
    @Req() req,
  ): Promise<RateDto> {
    return this.videosService.getRateVideo({
      videoId,
      userId: req.sub,
    });
  }

  @Post(':videoId/rate')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  rateAlbum(
    @Param('videoId') videoId: string,
    @Req() req,
    @Body() body: RateDto,
  ): Promise<void> {
    return this.videosService.setRateVideo({
      videoId,
      userId: req.sub,
      rate: body.rate,
    });
  }
}
