import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quality } from './quality.entity';
import { QualityDto } from './quality.dto';

@Injectable()
export class QualityService {
  constructor(
    @InjectRepository(Quality)
    private qualityRepository: Repository<QualityDto>,
  ) {}

  getQualities = async () => {
    return this.qualityRepository.find();
  };

  saveQuality = async ({ name, episode }: QualityDto): Promise<QualityDto> => {
    const result = await this.qualityRepository.findOne({
      where: { name },
      relations: ['episodes'],
    });
    if (!result) {
      return await this.qualityRepository.save({
        name,
        episodes: [{ url: episode.url, id: episode.id }],
      });
    }
    return await this.qualityRepository.save({
      ...result,
      episodes: [...result.episodes, { url: episode.url, id: episode.id }],
    });
  };
}
