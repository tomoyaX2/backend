import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { videoRelations } from 'src/shared/constants';
import { DefaultPaginationQuery } from 'src/shared/types';
import { In, Like, Repository } from 'typeorm';
import { LogService } from '../../log/log.service';
import { PaginatedTypeDto, TypeDto } from './type.dto';
import { Type } from './type.entity';
import { VideoDto } from '../video/video.dto';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private typesRepository: Repository<TypeDto>,
    private logService: LogService,
  ) {}

  async getTypes({
    page,
    perPage,
    name,
    withVideos,
  }: DefaultPaginationQuery): Promise<PaginatedTypeDto> {
    const [data, total] = await this.typesRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withVideos ? videoRelations : [],
      take: perPage,
      skip: (page - 1) * perPage,
      order: { name: 'ASC' },
    });
    return { data, total, currentPage: page };
  }

  async createType(type: TypeDto): Promise<TypeDto> {
    try {
      return await this.typesRepository.save(type);
    } catch (e) {}
  }

  async assignType(name: string) {
    try {
      const type = await this.typesRepository.findOne({ name });
      if (type?.name) {
        return type;
      }
      return await this.typesRepository.save({ name });
    } catch (e) {}
  }

  async assignVideoToType(video: VideoDto): Promise<void> {
    try {
      const targetType = await this.typesRepository.findOne(
        {
          id: video.type.id,
        },
        { relations: ['videos'] },
      );
      await this.typesRepository.save({
        ...targetType,
        videos: [...(targetType?.videos || []), video],
      });
    } catch (e) {
      this.logService.saveLog(
        `${e}, 'assign videos to tag error', ${JSON.stringify(video)}`,
        'warn',
      );
    }
  }

  getVideoIdsByTypesFilter = async ({
    filter,
    idsSet,
    avoidIdsSet,
  }: {
    filter: string[];
    idsSet: Set<string>;
    avoidIdsSet: Set<string>;
  }) => {
    const types = await this.typesRepository.find({
      where: { id: In(filter) },
      relations: ['videos'],
    });
    const typesRelatedVideosIds = new Set<string>();
    for (const type of types) {
      for (const video of type.videos) {
        typesRelatedVideosIds.add(video.id); // assign video to separate Set to combine and filter video ids later
      }
    }
    for (const stateVideoId of idsSet) {
      // get video ids
      if (
        !typesRelatedVideosIds.has(stateVideoId) ||
        avoidIdsSet.has(stateVideoId)
      ) {
        // check if it exists at tag related ids
        idsSet.delete(stateVideoId); // if not - remove id from original Set
      }
    }
  };

  deleteTypes = async ({ typeIds }: { typeIds: string[] }) => {
    try {
      await this.typesRepository.delete(typeIds);
    } catch (e) {
      console.error(e);
    }
  };
}
