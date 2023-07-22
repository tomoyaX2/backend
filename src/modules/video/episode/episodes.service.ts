import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Episode } from './eposide.entity';
import { EpisodeDto } from './episode.dto';
import { QualityService } from '../quality/quality.service';
import { VideoDto } from '../video/video.dto';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private episodeRepository: Repository<EpisodeDto>,
    private qualityService: QualityService,
  ) {}

  getAllEpisodes = async () => {
    return this.episodeRepository.find();
  };

  getEpisodesByVideoId = async ({ videoId }: { videoId: string }) => {
    return this.episodeRepository.find({
      where: { video: { id: videoId } },
      relations: ['video'],
    });
  };

  async createEpisode(episode: EpisodeDto): Promise<EpisodeDto> {
    try {
      const item = await this.episodeRepository.save({
        url: episode.url,
        name: episode.name,
      });
      const qualitiesToAssign = [];
      if (episode.availableQuality?.length) {
        for (const availableQuality of episode.availableQuality) {
          const quality = await this.qualityService.saveQuality({
            name: availableQuality,
            episode: item,
          });
          qualitiesToAssign.push(quality);
        }
      }
      if (qualitiesToAssign.length) episode.qualities = qualitiesToAssign;
      await this.episodeRepository.save(episode);
      const result = await this.episodeRepository.findOne({ id: episode.id });
      return result;
    } catch (e) {
      console.log('create episode failed', e);
    }
  }

  async updateEpisodeCover({ coverUrl, id }: { coverUrl: string; id: string }) {
    const episode = await this.episodeRepository.findOne(id);
    episode.coverUrl = coverUrl;
    await this.episodeRepository.save(episode);
  }

  deleteEpisode = async ({ episodeIds }: { episodeIds: string[] }) => {
    try {
      await this.episodeRepository.delete(episodeIds);
    } catch (e) {
      console.error(e);
    }
  };
}
