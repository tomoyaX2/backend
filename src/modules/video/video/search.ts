import { chunkArray, keys } from 'src/shared/utils';
import { FindManyOptions, getManager, Repository } from 'typeorm';
import { getDataWithRelations } from './sqlQueries';
import { SearchDto, VideoDto } from './video.dto';
import { NonUnifiedVideo } from './types';

const normalizeVideo = (item: NonUnifiedVideo): VideoDto => {
  return {
    id: item.Video_id,
    title: item.Video_title,
    // authors: [{ id: item.Video__authors_id, name: item.Video__authors_name }],
    // series: { id: item.Video__series_id, name: item.Video__series_name },
    language: { id: item.Video__language_id, name: item.Video__language_name },
    // group: { id: item.Video__group_id, name: item.Video__group_name },
    type: { id: item.Video__type_id, name: item.Video__type_name },
    studios: [
      {
        id: item.Video__studio_id,
        name: item.Video__studio_name,
      },
    ],
    views: item.Video_views,
    rate: item.Video_rate,
    coverImageUrl: item.Video_coverImageUrl,
    // episodes: [
    //   {
    //     id: item.Video__episodes_id,
    //     name: item.Video__episodes_name,
    //     url: item.Video__episodes_url,
    //   },
    // ],
    // tags: [
    //   {
    //     id: item.Video__tags_id,
    //     name: item.Video__tags_name,
    //     videosCount: item.Video__tags_VideosCount,
    //   },
    // ],
    rates: !item.Video__rates_id
      ? []
      : [
          {
            id: item.Video__rates_id,
            rate: item.Video__rates_rate,
          },
        ],
    // comments
  };
};

const unifySearchData = (searchData: NonUnifiedVideo[]): VideoDto[] => {
  const result = new Map<string, VideoDto>();

  for (const item of searchData) {
    const hasItem = result.has(item.Video_id);
    if (!hasItem) {
      result.set(item.Video_id, normalizeVideo(item));
    } else {
      const target = result.get(item.Video_id);
      // const hasCurrentTag = target.tags.some(
      //   (el) => el.id === item.Video__tags_id,
      // );
      const hasCurrentRate = target.rates.some(
        (el) => el.id === item.Video__rates_id,
      );
      // const hasEpisodes = target.episodes.some(
      //   (el) => el.id === item.Video__episodes_id,
      // );
      // if (!hasEpisodes) {
      //   const newEpisode = {
      //     id: item.Video__episodes_id,
      //     name: item.Video__episodes_name,
      //     url: item.Video__episodes_url,
      //   };
      //   result.set(item.Video_id, {
      //     ...target,
      //     episodes: [...target.episodes, newEpisode],
      //   });
      // }
      // if (!hasCurrentTag) {
      //   const newTag = {
      //     id: item.Video__tags_id,
      //     name: item.Video__tags_name,
      //     VideosCount: item.Video__tags_VideosCount,
      //   };
      //   result.set(item.Video_id, {
      //     ...target,
      //     tags: [...target.tags, newTag],
      //   });
      // }
      if (!hasCurrentRate) {
        const newRate = {
          id: item.Video__rates_id,
          rate: item.Video__rates_rate || 0,
        };
        result.set(item.Video_id, {
          ...target,
          rates: !newRate?.id ? target.rates : [...target.rates, newRate],
        });
      }
    }
  }
  return Array.from(result, ([_, value]) => value);
};

export const buildStrictPagination = async (
  filterData: SearchDto,
  videoRepository: Repository<VideoDto>,
) => {
  const videoIdsSet = new Set<string>();
  const allVideos = await videoRepository.find({
    order: filterData.sortBy ? filterData.sortBy : { created_date: 'DESC' },
  } as FindManyOptions<VideoDto>);

  for (const video of allVideos) {
    videoIdsSet.add(video.id);
  }
  if (filterData.title) {
    const titleSearchResult = await videoRepository
      .createQueryBuilder('video')
      .where('LOWER(title) LIKE :title', {
        title: `%${filterData.title.toLowerCase()}%`,
      })
      .getMany();
    const titleSearchSet = new Set<string>();
    for (const titleSearchItem of titleSearchResult) {
      titleSearchSet.add(titleSearchItem.id);
    }
    for (const resultItem of videoIdsSet) {
      if (!titleSearchSet.has(resultItem)) {
        videoIdsSet.delete(resultItem);
      }
    }
  }

  const resultIds = [...videoIdsSet];
  const chunkedData = chunkArray(resultIds, filterData.perPage);
  const dataToBuild = chunkedData[filterData.page - 1] || [];
  if (!dataToBuild.length) {
    return [[], resultIds.length];
  }
  const builtRelationsData = await getManager().query(
    getDataWithRelations(
      dataToBuild,
      keys(filterData.sortBy)[0] || 'created_date',
    ),
    dataToBuild,
  );
  const result = unifySearchData(builtRelationsData);
  return [result, resultIds.length];
};
