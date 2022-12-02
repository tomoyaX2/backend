import { AuthorService } from 'src/modules/authors/authors.service';
import { GroupService } from 'src/modules/group/group.service';
import { LanguagesService } from 'src/modules/languages/languages.service';
import { SeriesService } from 'src/modules/series/series.service';
import { TagsService } from 'src/modules/tags/tags.service';
import { AlbumPaginationQuery } from 'src/shared/types';
import { chunkArray } from 'src/shared/utils';
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
  tagsService: TagsService,
  authorsService: AuthorService,
  seriesService: SeriesService,
  languageService: LanguagesService,
  groupService: GroupService,
) => {
  const albumIdsSet = new Set<string>();
  const albumIdsToAvoidSet = new Set<string>();
  const exceptionTagIds = ['3d0a1bd6-f9b1-439a-91ac-24529e6655ae'];
  const albumToAvoidList = await getManager().query(
    getQueryWithFilteredExceptions(),
    exceptionTagIds,
  );
  for (const albumToAvoid of albumToAvoidList) {
    albumIdsToAvoidSet.add(albumToAvoid.album_id);
  }
  const allAlbums = await albumRepository.find({
    order: filterData.sortBy ? filterData.sortBy : { created_date: 'DESC' },
  } as FindManyOptions<AlbumDto>);
  const hasToFilterExceptionTags = !filterData.tags?.some((el) =>
    exceptionTagIds.includes(el),
  );

  for (const album of allAlbums) {
    if (hasToFilterExceptionTags) {
      if (!albumIdsToAvoidSet.has(album.id)) {
        albumIdsSet.add(album.id);
      }
    } else {
      albumIdsSet.add(album.id);
    }
  }

  if (filterData.tags) {
    await tagsService.getAlbumIdsByTagFilter({
      filter: filterData.tags,
      idsSet: albumIdsSet,
    }); //get all album ids by selected tag
  }
  if (filterData.authors) {
    await authorsService.getAlbumIdsByAuthorFilter({
      filter: filterData.authors,
      idsSet: albumIdsSet,
    }); //get all album ids by selected authors OR filter and merge with selected by tags
  }
  if (filterData.series) {
    await seriesService.getAlbumIdsBySeriesFilter({
      filter: filterData.series,
      idsSet: albumIdsSet,
    }); //get all album ids by selected authors OR filter and merge with selected by tags
  }
  if (filterData.language) {
    await languageService.getAlbumIdsByLanguageFilter({
      filter: filterData.language,
      idsSet: albumIdsSet,
    }); //get all album ids by selected authors OR filter and merge with selected by tags
  }
  if (filterData.group) {
    await groupService.getAlbumIdsByGroupFilter({
      filter: filterData.group,
      idsSet: albumIdsSet,
    }); //get all album ids by selected authors OR filter and merge with selected by tags
  }
  if (filterData.title) {
    const titleSearchResult = await albumRepository
      .createQueryBuilder('album')
      .where('LOWER(title) LIKE :title', {
        title: `%${filterData.title.toLowerCase()}%`,
      })
      .getMany();
    const titleSearchSet = new Set<string>();
    for (const titleSearchItem of titleSearchResult) {
      titleSearchSet.add(titleSearchItem.id);
    }
    for (const resultItem of albumIdsSet) {
      if (!titleSearchSet.has(resultItem)) {
        albumIdsSet.delete(resultItem);
      }
    }
  }

  // console.time();
  // const searchObject = {
  //   relations: ['authors', 'series', 'type', 'language', 'group', 'tags'],
  //   order: filterData.sortBy ? filterData.sortBy : { created_date: 'DESC' },
  //   skip: (filterData.page - 1) * filterData.perPage,
  //   take: filterData.perPage,
  // } as FindManyOptions<AlbumDto> & { title?: any };
  // const activeFilters = {};
  // const whereData = [];
  const resultIds = [...albumIdsSet];
  const chunkedData = chunkArray(resultIds, filterData.perPage);
  const dataToBuild = chunkedData[filterData.page - 1] || [];
  if (!dataToBuild.length) {
    return [[], resultIds.length];
  }
  const builtRelationsData = await getManager().query(
    getDataWithRelations(dataToBuild),
    dataToBuild,
  );
  // return [];
  // for (const filterKey of Object.keys(filterData)) {
  //   const data = filterData[filterKey];
  //   if (
  //     filterKey !== 'page' &&
  //     filterKey !== 'perPage' &&
  //     filterKey !== 'title'
  //   ) {
  //     if (data?.length) {
  //       activeFilters[filterKey] = data;
  //       whereData.push(`${filterKey}.id IN(:...${filterKey})`);
  //     }
  //   }
  //   if (filterKey === 'title' && data?.length) {
  //     whereData.push(`UPPER(title) LIKE UPPER('${data}%')`);
  //   }
  // }
  // const whereString = whereData.join(' AND ');
  // if (whereData.length) {
  //   searchObject.join = {
  //     alias: 'album',
  //     leftJoin: {
  //       tags: 'album.tags',
  //       group: 'album.group',
  //       authors: 'album.authors',
  //       series: 'album.series',
  //       type: 'album.type',
  //       language: 'album.language',
  //     },
  //   };
  //   searchObject.where = (qb) => {
  //     qb.where(whereString, activeFilters);
  //   };
  // }
  // const data = await albumRepository.findAndCount(searchObject);
  // console.timeEnd();

  const result = unifySearchData(builtRelationsData);
  return [result, resultIds.length];
};
