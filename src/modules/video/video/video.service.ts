import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LanguagesService } from '../languages/languages.service';
import { TagsService } from '../tags/tags.service';
import { TypeService } from '../type/type.service';
import { LogService } from '../../log/log.service';
import { DefaultPaginationQuery } from 'src/shared/types';
import * as _ from 'lodash';
import { RateService } from '../rate/rate.service';
import { videoRelations } from 'src/shared/constants';
import { UsersService } from 'src/modules/users/users.service';
import { Video } from './video.entity';
import {
  PaginatedVideoDto,
  ScrapperDto,
  ScrapperWithEpisodes,
  SearchDto,
  VideoDto,
} from './video.dto';
import { BlockedVideoService } from '../blocked/blocked.service';
import { EpisodeService } from '../episode/episodes.service';
import { appendRate } from 'src/modules/manga/album/utils/appendRate';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<VideoDto>,
    private languageService: LanguagesService,
    private tagsService: TagsService,
    private typeService: TypeService,
    private logService: LogService,
    private episodeService: EpisodeService,
    private usersService: UsersService,
    private rateService: RateService,
    private blockedVideoService: BlockedVideoService,
  ) {}

  async getVideos({
    page,
    perPage,
  }: DefaultPaginationQuery): Promise<PaginatedVideoDto> {
    const [data, total] = await this.videoRepository.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage,
      relations: ['tags', 'language', 'type', 'episodes'],
      order: { created_date: 'DESC' },
    });
    return { data, total, currentPage: page };
  }

  async getVideoById(
    id: string,
    ignoreViews = false,
    relations: string[] = videoRelations,
  ): Promise<VideoDto> {
    const video = await this.videoRepository.findOne({
      relations,
      where: { id },
    });
    if (!video) {
      throw new NotFoundException({ message: 'Video not found' });
    }
    if (!ignoreViews) {
      video.views = video.views + 1;
      this.videoRepository.save(video);
    }
    return {
      ...video,
      rate: video?.rate || 0,
    };
  }

  async search(
    body: SearchDto,
    relations: string[] = videoRelations,
  ): Promise<PaginatedVideoDto> {
    const [data, total] = await this.videoRepository.findAndCount({
      relations,
      where: { title: body.title },
      order: { created_date: 'DESC' },
    });
    return {
      data: appendRate(data as VideoDto[]) ?? [],
      total,
      currentPage: body.page,
    } as any;
  }

  async getPlainVideoById(id: string): Promise<VideoDto> {
    const album = await this.videoRepository.findOne({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException({ message: 'Album not found' });
    }
    return album;
  }

  async getVideoForScrapperFilter(
    where: Record<string, string>,
  ): Promise<boolean> {
    const video = await this.videoRepository.findOne({
      relations: ['language'],
      where,
    });
    return !!video;
  }

  async createVideo(album: VideoDto): Promise<VideoDto> {
    const result = await this.videoRepository.save(album);
    return result;
  }

  async updateVideo(videoId: string, video: VideoDto) {
    const data = await this.videoRepository.findOne({ id: videoId });
    const result = await this.videoRepository.save({ ...data, ...video });
    return result;
  }

  async generateVideo({
    scrapperData: {
      title,
      episodes,
      coverImageUrl,
      description,
      releaseDate,
      type,
      language,
      tags,
    },
  }: {
    scrapperData: ScrapperDto & ScrapperWithEpisodes;
  }) {
    const video = await this.videoRepository.save({
      title,
      description,
      coverImageUrl,
      releaseDate,
    });
    const tagsToAssign = [];
    const episodesToAssign = [];
    for (const tag of tags) {
      const result = await this.tagsService.assignTag(tag, video);
      tagsToAssign.push(result);
    }
    const languageToAssign = await this.languageService.assignLanguage(
      language,
    );
    video.language = languageToAssign;
    const typeToAssign = await this.typeService.assignType(type);
    video.type = typeToAssign;
    for (const episode of episodes) {
      const episodeToAssign = await this.episodeService.createEpisode(
        episode,
        video,
      );
      episodesToAssign.push(episodeToAssign);
    }
    video.episodes = episodesToAssign;
    video.tags = tagsToAssign;
    console.log(video, 'video');
    return await this.videoRepository.save(video);
  }

  deleteVideoById = async (id: string) => {
    const video = await this.videoRepository.findOne(
      { id },
      { relations: ['tags'] },
    );
    for (const tag of video.tags) {
      await this.tagsService.onRemoveVideo({ tagId: tag.id });
    }

    return this.videoRepository.delete(id);
  };

  getRateVideo = async ({ videoId, userId }) => {
    const video = await this.videoRepository.findOne(
      { id: videoId },
      { relations: ['rates'] },
    );
    const user = await this.usersService.getUserById(userId, ['rates']);
    const result = await this.rateService.getRate({ video, user });
    return result;
  };

  setRateVideo = async ({ videoId, userId, rate }) => {
    const video = await this.videoRepository.findOne(
      { id: videoId },
      { relations: ['rates'] },
    );
    const user = await this.usersService.getUserById(userId, ['rates']);
    await this.rateService.saveRate({ video, user, rate });
  };
}
