import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Like, Repository } from 'typeorm';
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
import { StudioService } from '../studio/studio.service';
import { buildStrictPagination } from './search';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(Video)
    private videoRepository: Repository<VideoDto>,
    private languageService: LanguagesService,
    private tagsService: TagsService,
    private typeService: TypeService,
    private logService: LogService,
    private studioService: StudioService,
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

  async search(body: SearchDto): Promise<PaginatedVideoDto> {
    const [data, total] = await buildStrictPagination(
      body,
      this.videoRepository,
      // this.tagsService,
      // this.authorsService,
      // this.seriesService,
      // this.languageService,
      // this.groupService,
    );
    //TODO: make with sql query
    return {
      data: appendRate(data as VideoDto[]) ?? [],
      total,
      currentPage: body.page,
    } as any;
  }

  getVideoByTitle = async (title: string) => {
    let video = null;
    video = await this.videoRepository.findOne({
      where: { title },
      relations: ['episodes'],
    });
    if (!video) {
      video = await this.videoRepository.findOne({
        where: { title: `${title}!` },
        relations: ['episodes'],
      });
    }
    if (!video) {
      video = await this.videoRepository.findOne({
        where: { title: ILike(`%${title}%`) },
        relations: ['episodes'],
      });
    }
    if (!video) {
      video = await this.videoRepository.findOne({
        where: { title: ILike(`%${title.substring(0, title.length / 2)}%`) },
        relations: ['episodes'],
      });
    }
    return video;
  };

  async getPlainVideoById(id: string): Promise<VideoDto> {
    const video = await this.videoRepository.findOne({
      where: { id },
    });
    if (!video) {
      throw new NotFoundException({ message: 'Video not found' });
    }
    return video;
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
    const data = await this.videoRepository.findOne(
      {
        id: videoId,
      },
      { relations: ['episodes', 'episodes.qualities'] },
    );
    if (video.episodes) {
      for (const episode of video.episodes) {
        if (episode) {
          const isEpisodeExists = data.episodes.some(
            (el) => el.name === episode.name,
          );
          if (!isEpisodeExists) {
            const episodeToAssign = await this.episodeService.createEpisode(
              episode,
            );

            data.episodes.push(episodeToAssign);
          }
        }
      }
    }
    if (video.tags) {
      for (const tag of video.tags) {
        if (tag) {
          const isTagExists = data.tags.some((el) => el.name === tag.name);
          if (!isTagExists) {
            const tagsToAssign = await this.tagsService.assignTag(tag.name);

            data.tags.push(tagsToAssign);
          }
        }
      }
    }

    if (video.studios) {
      for (const studio of video.studios) {
        if (studio) {
          const isStudioExists = data.studios.some(
            (el) => el.name === studio.name,
          );
          if (!isStudioExists) {
            const studioToAssign = await this.studioService.assignStudio(
              studio.name,
            );
            data.studios.filter((el) => !!el.id);
            data.studios.push(studioToAssign);
          }
        }
      }
    }
    data.title = video.title;
    // data.description = video?.description;
    if (video.coverImageUrl) {
      data.coverImageUrl = video.coverImageUrl;
    }
    data.releaseDate = video.releaseDate;
    const result = await this.videoRepository.save(data);
    return result;
  }

  async generateVideo({
    scrapperData: {
      title,
      episodes,
      coverImageUrl,
      description,
      type,
      language,
      tags,
      studios,
    },
  }: {
    scrapperData: ScrapperDto & ScrapperWithEpisodes;
  }) {
    // const date = moment(new Date(releaseDate)).format();
    const video = await this.videoRepository.save({
      title,
      description,
      coverImageUrl,
      releaseDate: null,
    });
    const tagsToAssign = [];
    const episodesToAssign = [];
    const studiosToAssign = [];
    for (const tag of tags || []) {
      const result = await this.tagsService.assignTag(tag, video);
      tagsToAssign.push(result);
    }
    const languageToAssign = await this.languageService.assignLanguage(
      language,
    );
    video.language = languageToAssign;
    for (const studio of studios || []) {
      const studioToAssign = await this.studioService.assignStudio(studio);
      studiosToAssign.push(studioToAssign);
    }

    const typeToAssign = await this.typeService.assignType(type);
    video.type = typeToAssign;
    for (const episode of episodes) {
      const episodeToAssign = await this.episodeService.createEpisode(episode);
      episodesToAssign.push(episodeToAssign);
    }
    video.episodes = episodesToAssign;
    // video.tags = tagsToAssign;
    // video.studios = studiosToAssign;

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

  updateVideoTags = async ({
    tags,
    videoId,
  }: {
    tags: string[];
    videoId: string;
  }) => {
    const video = await this.getVideoById(videoId);
    for (const tag of tags) {
      const isTagPresentAlready = video.tags.some((el) => el.name === tag);
      if (!isTagPresentAlready) {
        const updatedTag = await this.tagsService.assignTag(tag, video);
        video.tags = [...video.tags, updatedTag];
      }
    }
    await this.videoRepository.save(video);
  };
}
