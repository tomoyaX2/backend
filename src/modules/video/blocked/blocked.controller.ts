import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BlockedVideoDto, BlockedVideoBodyDto } from './blocked.dto';
import { BlockedVideoService } from './blocked.service';

@Controller('blocked-video')
export class BlockedVideoController {
  constructor(private readonly blockedVideoService: BlockedVideoService) {}

  @Get()
  getVideos(): Promise<BlockedVideoDto[]> {
    return this.blockedVideoService.getBlockedTitles();
  }

  @Post('check')
  getVideoById(
    @Body()
    data: BlockedVideoBodyDto,
  ): Promise<BlockedVideoDto> {
    return this.blockedVideoService.getBlockedTitle(data.name);
  }

  @Post('')
  blockVideo(
    @Body()
    data: BlockedVideoBodyDto,
  ): Promise<void> {
    return this.blockedVideoService.blockVideo(data);
  }

  @Delete(':title')
  async deleteVideoById(@Param('title') title: string): Promise<void> {
    await this.blockedVideoService.removeBlockedVideo(title);
  }
}
