import { AlbumPaginationQuery } from 'src/shared/types';
import { FindManyOptions, getManager, Repository } from 'typeorm';
import { AlbumDto } from '../album.dto';
import {
  getDataWithRelations,
  getQueryWithFilteredExceptions,
} from './sqlQueries';
import { NonUnifiedAlbum } from './types';

const normalizeAlbum = (item: NonUnifiedAlbum): AlbumDto => {
  return {
    id: item.Album_id,
    title: item.Album_title,
    authors: [{ id: item.Album__authors_id, name: item.Album__authors_name }],
    series: { id: item.Album__series_id, name: item.Album__series_name },
    language: { id: item.Album__language_id, name: item.Album__language_name },
    group: { id: item.Album__group_id, name: item.Album__group_name },
    type: { id: item.Album__type_id, name: item.Album__type_name },
    previewOrientation: item.Album_previewOrientation,
    path: item.Album_path,
    views: item.Album_views,
    rate: item.Album_rate,
    preview: item.Album_preview,
    downloadPath: item.Album_downloadPath,
    totalImages: item.Album_totalImages,
    tags: [{ id: item.Album__tags_id, name: item.Album__tags_name }],
    // comments
  };
};

const unifySearchData = (searchData: NonUnifiedAlbum[]): AlbumDto[] => {
  const result = new Map<string, AlbumDto>();
  for (const item of searchData) {
    const hasItem = result.has(item.Album_id);
    if (!hasItem) {
      result.set(item.Album_id, normalizeAlbum(item));
    } else {
      const target = result.get(item.Album_id);
      const hasCurrentTag = target.tags.some(
        (el) => el.id === item.Album__tags_id,
      );
      const hasCurrentAuthor = target.authors.some(
        (el) => el.id === item.Album__authors_id,
      );
      if (!hasCurrentTag) {
        const newTag = {
          id: item.Album__tags_id,
          name: item.Album__tags_name,
        };
        result.set(item.Album_id, {
          ...target,
          tags: [...target.tags, newTag],
        });
      }
      if (!hasCurrentAuthor) {
        const newAuthor = {
          id: item.Album__authors_id,
          name: item.Album__authors_name,
        };
        result.set(item.Album_id, {
          ...target,
          authors: [...target.authors, newAuthor],
        });
      }
    }
  }
  return Array.from(result, ([_, value]) => value);
};

export const buildStrictPagination = async (
  filterData: AlbumPaginationQuery,
  albumRepository: Repository<AlbumDto>,
) => {
  const searchObject = {
    relations: ['authors', 'series', 'type', 'language', 'group', 'tags'],
    order: filterData.sortBy ? filterData.sortBy : { created_date: 'DESC' },
    skip: (filterData.page - 1) * filterData.perPage,
    take: filterData.perPage,
  } as FindManyOptions<AlbumDto> & { title?: any };
  const activeFilters = {};
  const whereData = [];
  // const exceptionTagIds = ['ccdedc8a-3643-4b2c-a5aa-f60e588d81d0'];
  // const filteredTagsSearchResult = await getManager().query(
  //   getQueryWithFilteredExceptions({
  //     limit: filterData.perPage,
  //     offset: (filterData.page - 1) * filterData.perPage,
  //   }),
  //   exceptionTagIds,
  // );
  // console.log(filteredTagsSearchResult, 'filteredTagsSearchResult');
  // const albumIds = filteredTagsSearchResult.map((el) => el.album_id);
  // const builtRelationsData = await getManager().query(
  //   getDataWithRelations(filteredTagsSearchResult),
  //   albumIds,
  // );
  // console.log(unifySearchData(builtRelationsData), 'test1');
  // return [];
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
