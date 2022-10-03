import { AlbumPaginationQuery } from 'src/shared/types';
import { FindManyOptions, Repository } from 'typeorm';
import { AlbumDto } from './album.dto';

export const buildStrictPagination = async (
  filterData: AlbumPaginationQuery,
  albumRepository: Repository<AlbumDto>,
) => {
  const searchObject = {
    relations: ['authors', 'series', 'type', 'language', 'group', 'tags'],
    order: filterData.sortBy ? filterData.sortBy : { createdDate: 'DESC' },
    skip: (filterData.page - 1) * filterData.perPage,
    take: filterData.perPage,
  } as FindManyOptions<AlbumDto> & { title?: any };
  const activeFilters = {};
  const whereData = [];

  for (const filterKey of Object.keys(filterData)) {
    const data = filterData[filterKey];
    if (
      filterKey !== 'page' &&
      filterKey !== 'perPage' &&
      filterKey !== 'title'
    ) {
      if (data?.length) {
        activeFilters[filterKey] = data;
        whereData.push(`${filterKey}.id IN(:...${filterKey})`);
      }
    }
    if (filterKey === 'title' && data?.length) {
      whereData.push(`UPPER(title) LIKE UPPER('${data}%')`);
    }
  }
  const whereString = whereData.join(' AND ');
  if (whereData.length) {
    searchObject.join = {
      alias: 'album',
      leftJoin: {
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
  const data = await albumRepository.findAndCount(searchObject);

  return data;
};
