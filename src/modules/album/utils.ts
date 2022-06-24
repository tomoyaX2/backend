import { AlbumPaginationQuery } from 'src/shared/types';
import { FindManyOptions, Repository } from 'typeorm';
import { AlbumDto } from './album.dto';
import * as _ from 'lodash';

export const buildStrictPagination = async (
  filterData: AlbumPaginationQuery,
  albumRepository: Repository<AlbumDto>,
) => {
  const searchObject = {
    relations: ['authors', 'series', 'type', 'language', 'group', 'tags'],
    order: { createdDate: 'ASC' },
    skip: (filterData.page - 1) * filterData.perPage,
    take: filterData.perPage,
  } as FindManyOptions<AlbumDto>;
  const activeFilters = {};
  const whereData = [];
  console.log(new Date(), '0');
  for (const filterKey of Object.keys(filterData)) {
    if (filterKey !== 'page' && filterKey !== 'perPage') {
      const data = filterData[filterKey];
      if (data?.length) {
        activeFilters[filterKey] = data;
        whereData.push(`${filterKey}.id IN(:...${filterKey})`);
      }
    }
  }
  if (whereData.length) {
    searchObject.join = {
      alias: 'album',
      innerJoin: {
        tags: 'album.tags',
        group: 'album.group',
        authors: 'album.authors',
        series: 'album.series',
        type: 'album.type',
        language: 'album.language',
      },
    };
    searchObject.where = (qb) => {
      qb.where(whereString, activeFilters);
    };
  }
  const whereString = whereData.join(' AND ');
  const data = await albumRepository.findAndCount(searchObject);

  return data;
};
