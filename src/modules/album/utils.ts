import { AlbumPaginationQuery } from 'src/shared/types';
import { Repository } from 'typeorm';
import { AlbumDto } from './album.dto';
import * as _ from 'lodash';
import { chunkArray } from 'src/shared/utils';

export const buildStrictPagination = async (
  filterData: AlbumPaginationQuery,
  albumRepository: Repository<AlbumDto>,
) => {
  const whereData = {};
  console.log(new Date(), '0');
  const data = await albumRepository.find({
    relations: [
      'authors',
      'series',
      'type',
      'images',
      'language',
      'group',
      'tags',
    ],
  });
  console.log(new Date(), '1');
  const activeFilters = Object.keys(filterData).filter((key) => {
    const isActive = !!filterData[key]?.length;
    if (isActive)
      whereData[key] = Array.isArray(filterData[key])
        ? filterData[key]
        : [filterData[key]];
    return isActive;
  });
  console.log(new Date(), '2');
  const result = data.filter((item) => {
    const isValid = true;
    //TODO: REWORK TO SQL
    for (const key of activeFilters) {
      if (Array.isArray(filterData[key])) {
        const hasToBeFiltered = Array.isArray(item[key]) // if item has many to many relation the search should be applied as an array type
          ? item[key].filter((el) => {
              //get item data by active filter key
              return filterData[key].includes(el.id); //if tag of item is included into filter - leave it as as, otherwise - remove from array
            })?.length < filterData[key].length // if array length is bigger than filters - it's our needed result. That means, target album contains every tag from user's exectatons
          : item[key] // if relation is ane to many, array of filter items should include an album prop
          ? !filterData[key].includes(item[key].id)
          : true;

        if (hasToBeFiltered) {
          return false;
        }
      } else {
        const isInvalidName = !item[key]
          .toLowerCase()
          .includes(filterData[key].toLowerCase());
        if (isInvalidName) {
          return false;
        }
      }
    }
    return isValid;
  });
  console.log(new Date(), '3');
  return [
    chunkArray(
      result.map((el) => ({
        ...el,
        totalImages: el.images.length,
        images: _.orderBy(el.images, ['url']).slice(0, 10),
      })),
      filterData.perPage,
    )[filterData.page - 1],
    result.length,
  ];
};
