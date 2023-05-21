import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockedVideoDto } from './blocked.dto';
import { BlockedVideo } from './blocked.entity';

@Injectable()
export class BlockedVideoService {
  constructor(
    @InjectRepository(BlockedVideo)
    private blockedVideoRepository: Repository<BlockedVideoDto>,
  ) {}

  async getBlockedTitles(): Promise<BlockedVideoDto[]> {
    const data = await this.blockedVideoRepository.find();
    return data;
  }

  async getBlockedTitle(name: string): Promise<BlockedVideoDto> {
    const data = await this.blockedVideoRepository.findOne({ name });
    return data;
  }

  async blockVideo(data: BlockedVideoDto): Promise<void> {
    await this.blockedVideoRepository.save(data);
  }

  async removeBlockedVideo(name: string): Promise<void> {
    const video = await this.blockedVideoRepository.findOne({ name });
    await this.blockedVideoRepository.remove(video);
  }
}
