import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { albumRelations } from 'src/shared/constants';
import { DefaultPaginationQuery } from 'src/shared/types';
import { In, Like, Repository } from 'typeorm';
import { AlbumDto } from '../album/album.dto';
import { LogService } from '../log/log.service';
import { LanguageDto, PaginatedLanguageDto } from './languages.dto';
import { Language } from './languages.entity';

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
    withAlbums,
  }: DefaultPaginationQuery): Promise<PaginatedLanguageDto> {
    const [data, total] = await this.languagesRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withAlbums ? albumRelations : [],
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

  async assignAlbumToLanguage(album: AlbumDto): Promise<void> {
    try {
      const targetLanguage = await this.languagesRepository.findOne(
        {
          id: album.language.id,
        },
        { relations: ['albums'] },
      );
      await this.languagesRepository.save({
        ...targetLanguage,
        albums: [...(targetLanguage?.albums || []), album],
      });
    } catch (e) {
      this.logService.saveLog(
        `${e}, 'assign album to language error', ${JSON.stringify(album)}`,
        'warn',
      );
    }
  }

  getAlbumIdsByLanguageFilter = async ({
    filter,
    idsSet,
  }: {
    filter: string[];
    idsSet: Set<string>;
  }) => {
    const languages = await this.languagesRepository.find({
      where: { id: In(filter) },
      relations: ['albums'],
    });
    const languagesRelatedAlbumIds = new Set<string>();
    for (const language of languages) {
      for (const album of language.albums) {
        languagesRelatedAlbumIds.add(album.id); // assign album to separate Set to combine and filter album ids later
      }
    }
    for (const stateAlbumId of idsSet) {
      // get album ids
      if (!languagesRelatedAlbumIds.has(stateAlbumId)) {
        // check if it exists at tag related ids
        idsSet.delete(stateAlbumId); // if not - remove id from original Set
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
