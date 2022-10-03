import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockedAlbumDto } from './blocked.dto';
import { BlockedAlbum } from './blocked.entity';

@Injectable()
export class BlockedAlbumService {
  constructor(
    @InjectRepository(BlockedAlbum)
    private blockedAlbumRepository: Repository<BlockedAlbumDto>,
  ) {}

  async getBlockedTitles(): Promise<BlockedAlbumDto[]> {
    const data = await this.blockedAlbumRepository.find();
    return data;
  }

  async getBlockedTitle(name: string): Promise<BlockedAlbumDto> {
    const data = await this.blockedAlbumRepository.findOne({ name });
    return data;
  }

  async blockAlbum(data: BlockedAlbumDto): Promise<void> {
    await this.blockedAlbumRepository.save(data);
  }

  async removeBlockedAlbum(name: string): Promise<void> {
    const album = await this.blockedAlbumRepository.findOne({ name });
    await this.blockedAlbumRepository.remove(album);
  }
}
