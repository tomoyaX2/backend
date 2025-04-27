import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultPaginationQuery } from 'src/shared/types';
import { In, Like, Repository } from 'typeorm';
import { Album } from '../album/album.entity';
import { LogService } from '../../log/log.service';
import { PaginatedSeriesDto, SeriesDto } from './series.dto';
import { Series } from './series.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectRepository(Series)
    private seriesRepository: Repository<SeriesDto>,
    private logService: LogService,
  ) {}

  async getSeries({
    page,
    perPage,
    name,
    withAlbums,
  }: DefaultPaginationQuery): Promise<PaginatedSeriesDto> {
    const [data, total] = await this.seriesRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withAlbums ? ['albums'] : [],
      take: perPage,
      skip: (page - 1) * perPage,
      order: { name: 'ASC' },
    });
    return { data, total, currentPage: page };
  }

  async createSeries(series: SeriesDto): Promise<SeriesDto> {
    try {
      return await this.seriesRepository.save(series);
    } catch (e) {}
  }

  async assignSeries(name: string): Promise<SeriesDto> {
    try {
      const series = await this.seriesRepository.findOne({ name });
      if (series?.name) {
        return series;
      }
      return await this.seriesRepository.save({ name });
    } catch (e) {}
  }

  async assignAlbumToSeries(album: Album): Promise<SeriesDto> {
    try {
      const targetSeries = await this.seriesRepository.findOne(
        {
          id: album.series.id,
        },
        { relations: ['album'] },
      );
      return await this.seriesRepository.save({
        ...targetSeries,
        albums: [...(targetSeries?.albums || []), album] as any,
      });
    } catch (e) {
      this.logService.saveLog(
        `${e}, 'assign album to series error', ${JSON.stringify(album)}`,
        'warn',
      );
    }
  }

  getAlbumIdsBySeriesFilter = async ({
    filter,
    idsSet,
  }: {
    filter: string[];
    idsSet: Set<string>;
  }) => {
    const series = await this.seriesRepository.find({
      where: { id: In(filter) },
      relations: ['albums'],
    });
    const seriesRelatedAlbumIds = new Set<string>();
    for (const seriesItem of series) {
      for (const album of seriesItem.albums) {
        seriesRelatedAlbumIds.add(album.id); // assign album to separate Set to combine and filter album ids later
      }
    }
    for (const stateAlbumId of idsSet) {
      // get album ids
      if (!seriesRelatedAlbumIds.has(stateAlbumId)) {
        // check if it exists at tag related ids
        idsSet.delete(stateAlbumId); // if not - remove id from original Set
      }
    }
  };

  deleteSeries = async ({ seriesIds }: { seriesIds: string[] }) => {
    try {
      await this.seriesRepository.delete(seriesIds);
    } catch (e) {
      console.error(e);
    }
  };
}
