import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { videoRelations } from 'src/shared/constants';
import { DefaultPaginationQuery } from 'src/shared/types';
import { In, Like, Repository } from 'typeorm';
import { LogService } from '../../log/log.service';
import { StudioDto, PaginatedStudioDto } from './studio.dto';
import { Studio } from './studio.entity';
import { VideoDto } from '../video/video.dto';

@Injectable()
export class StudioService {
  constructor(
    @InjectRepository(Studio)
    private studioRepository: Repository<StudioDto>,
    private logService: LogService,
  ) {}

  async getStudios({
    page,
    perPage,
    name,
    withVideos,
  }: DefaultPaginationQuery): Promise<PaginatedStudioDto> {
    const [data, total] = await this.studioRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withVideos ? videoRelations : [],
      take: perPage,
      skip: (page - 1) * perPage,
      order: { name: 'ASC' },
    });
    return { data, total, currentPage: page };
  }

  async createStudio(studio: StudioDto): Promise<StudioDto> {
    try {
      return await this.studioRepository.save(studio);
    } catch (e) {}
  }

  async assignStudio(name: string): Promise<StudioDto> {
    try {
      const studio = await this.studioRepository.findOne({ name });
      if (studio?.name) {
        return studio;
      }
      return await this.studioRepository.save({ name });
    } catch (e) {}
  }

  async assignVideoToStudio(video: VideoDto): Promise<void> {
    try {
      for (const studio of video.studios) {
        const targetStudio = await this.studioRepository.findOne(
          {
            id: studio.id,
          },
          { relations: ['videos'] },
        );
        await this.studioRepository.save({
          ...targetStudio,
          videos: [...(targetStudio?.videos || []), video],
        });
      }
    } catch (e) {
      this.logService.saveLog(
        `${e}, 'assign video to studio error', ${JSON.stringify(video)}`,
        'warn',
      );
    }
  }

  getVideoIdsByStudioFilter = async ({
    filter,
    idsSet,
  }: {
    filter: string[];
    idsSet: Set<string>;
  }) => {
    const studios = await this.studioRepository.find({
      where: { id: In(filter) },
      relations: ['videos'],
    });
    const studiosRelatedVideoIds = new Set<string>();
    for (const studio of studios) {
      for (const video of studio.videos) {
        studiosRelatedVideoIds.add(video.id); // assign video to separate Set to combine and filter video ids later
      }
    }
    for (const stateVideoId of idsSet) {
      // get video ids
      if (!studiosRelatedVideoIds.has(stateVideoId)) {
        // check if it exists at tag related ids
        idsSet.delete(stateVideoId); // if not - remove id from original Set
      }
    }
  };

  deleteStudios = async ({ studioIds }: { studioIds: string[] }) => {
    try {
      await this.studioRepository.delete(studioIds);
    } catch (e) {
      console.error(e);
    }
  };
}
