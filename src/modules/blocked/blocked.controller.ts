import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BlockedAlbumDto, BlockedAlbumBodyDto } from './blocked.dto';
import { BlockedAlbumService } from './blocked.service';

@Controller('blocked-albums')
export class BlockedAlbumController {
  constructor(private readonly blockedAlbumService: BlockedAlbumService) {}

  @Get()
  getAlbums(): Promise<BlockedAlbumDto[]> {
    return this.blockedAlbumService.getBlockedTitles();
  }

  @Post('check')
  getAlbumById(
    @Body()
    data: BlockedAlbumBodyDto,
  ): Promise<BlockedAlbumDto> {
    return this.blockedAlbumService.getBlockedTitle(data.name);
  }

  @Post('')
  blockAlbum(
    @Body()
    data: BlockedAlbumBodyDto,
  ): Promise<void> {
    return this.blockedAlbumService.blockAlbum(data);
  }

  @Delete(':title')
  async deleteAlbumById(@Param('title') title: string): Promise<void> {
    await this.blockedAlbumService.removeBlockedAlbum(title);
  }
}
