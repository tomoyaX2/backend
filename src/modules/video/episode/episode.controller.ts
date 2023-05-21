import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../auth/auth.guard';
import { EpisodeDto } from './episode.dto';
import { EpisodeService } from './episodes.service';

@Controller('episodes')
export class EpisodesController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  getAllEpisodes() {
    return this.episodeService.getAllEpisodes();
  }

  @Get('all')
  getAllEpisodesByVideoId(@Param(':videoId') videoId: string) {
    return this.episodeService.getEpisodesByVideoId({ videoId });
  }

  @Post()
  createEpisode(@Body() episode: EpisodeDto): Promise<EpisodeDto> {
    return this.episodeService.createEpisode(episode);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiQuery({
    name: 'episodeIds',
    type: [String],
    required: true,
  })
  deleteEpisode(
    @Query('episodeIds', ParseArrayPipe) episodeIds: string[],
  ): Promise<void> {
    return this.episodeService.deleteEpisode({ episodeIds });
  }
}
