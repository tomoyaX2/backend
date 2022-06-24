import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { albumRelations } from 'src/shared/constants';
import { DefaultPaginationQuery } from 'src/shared/types';
import { Like, Repository } from 'typeorm';
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
      const targetLanguage = await this.languagesRepository.findOne({
        id: album.language.id,
      });
      console.log(targetLanguage, 'targetLanguage');
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
}
