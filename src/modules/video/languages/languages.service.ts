import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { videoRelations } from 'src/shared/constants';
import { DefaultPaginationQuery } from 'src/shared/types';
import { In, Like, Repository } from 'typeorm';
import { LogService } from '../../log/log.service';
import { LanguageDto, PaginatedLanguageDto } from './languages.dto';
import { Language } from './languages.entity';
import { VideoDto } from '../video/video.dto';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private languagesRepository: Repository<LanguageDto>,
    private logService: LogService,
  ) {}

  async getLanguages({
    page,
    perPage,
    name,
    withVideos,
  }: DefaultPaginationQuery): Promise<PaginatedLanguageDto> {
    const [data, total] = await this.languagesRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withVideos ? ['videos'] : [],
      take: perPage,
      skip: (page - 1) * perPage,
      order: { name: 'ASC' },
    });
    return { data, total, currentPage: page };
  }

  async createLanguage(language: LanguageDto): Promise<LanguageDto> {
    try {
      return await this.languagesRepository.save(language);
    } catch (e) {}
  }

  async assignLanguage(name: string): Promise<LanguageDto> {
    try {
      const language = await this.languagesRepository.findOne({ name });
      if (language?.name) {
        return language;
      }
      return await this.languagesRepository.save({ name });
    } catch (e) {}
  }

  async assignVideoToLanguage(video: VideoDto): Promise<void> {
    try {
      const targetLanguage = await this.languagesRepository.findOne(
        {
          id: video.language.id,
        },
        { relations: ['videos'] },
      );
      await this.languagesRepository.save({
        ...targetLanguage,
        videos: [...(targetLanguage?.videos || []), video],
      });
    } catch (e) {
      this.logService.saveLog(
        `${e}, 'assign video to language error', ${JSON.stringify(video)}`,
        'warn',
      );
    }
  }

  getVideoIdsByLanguageFilter = async ({
    filter,
    idsSet,
  }: {
    filter: string[];
    idsSet: Set<string>;
  }) => {
    const languages = await this.languagesRepository.find({
      where: { id: In(filter) },
      relations: ['videos'],
    });
    const languagesRelatedVideoIds = new Set<string>();
    for (const language of languages) {
      for (const video of language.videos) {
        languagesRelatedVideoIds.add(video.id); // assign video to separate Set to combine and filter video ids later
      }
    }
    for (const stateVideoId of idsSet) {
      // get video ids
      if (!languagesRelatedVideoIds.has(stateVideoId)) {
        // check if it exists at tag related ids
        idsSet.delete(stateVideoId); // if not - remove id from original Set
      }
    }
  };

  deleteLanguages = async ({ languagesId }: { languagesId: string[] }) => {
    try {
      await this.languagesRepository.delete(languagesId);
    } catch (e) {
      console.error(e);
    }
  };
}
