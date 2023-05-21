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
    private episodeService: Repository<EpisodeDto>,
    private qualityService: QualityService,
  ) {}

  getAllEpisodes = async () => {
    return this.episodeService.find();
  };

  getEpisodesByVideoId = async ({ videoId }: { videoId: string }) => {
    return this.episodeService.find({
      where: { video: { id: videoId } },
      relations: ['video'],
    });
  };

  async createEpisode(
    episode: EpisodeDto,
    video?: VideoDto,
  ): Promise<EpisodeDto> {
    try {
      const item = await this.episodeService.save({
        url: episode.url,
        name: episode.name,
      });
      const qualitiesToAssign = [];
      for (const availableQuality of episode.availableQuality) {
        const quality = await this.qualityService.saveQuality({
          name: availableQuality,
          episode: item,
        });
        qualitiesToAssign.push(quality);
        if (video) episode.video = video;
      }
      episode.qualities = qualitiesToAssign;
      await this.episodeService.save(episode);
      const result = await this.episodeService.findOne({ id: episode.id });
      return result;
    } catch (e) {
      console.log('create episode failed', e);
    }
  }

  deleteEpisode = async ({ episodeIds }: { episodeIds: string[] }) => {
    try {
      await this.episodeService.delete(episodeIds);
    } catch (e) {
      console.error(e);
    }
  };
}
