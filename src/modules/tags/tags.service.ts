import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { albumRelations } from 'src/shared/constants';
import { DefaultPaginationQuery } from 'src/shared/types';
import { In, Like, Repository } from 'typeorm';
import { AlbumDto } from '../album/album.dto';
import { LogService } from '../log/log.service';
import { PaginatedTagsDto, TagsDto } from './tags.dto';
import { Tag } from './tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<TagsDto>,
    private logService: LogService,
  ) {}

  async getTags({
    page,
    perPage,
    name,
    withAlbums,
  }: DefaultPaginationQuery): Promise<PaginatedTagsDto> {
    const [data, total] = await this.tagsRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withAlbums ? albumRelations : [],
      take: perPage,
      skip: (page - 1) * perPage,
      order: { name: 'ASC' },
    });
    return { data, total, currentPage: page };
  }

  async saveTag(tag: TagsDto): Promise<TagsDto> {
    try {
      return await this.tagsRepository.save(tag);
    } catch (e) {}
  }

  async assignTag(name: string): Promise<TagsDto> {
    try {
      const tag = await this.tagsRepository.findOne({ name });
      if (tag?.name) {
        return tag;
      }
      return await this.tagsRepository.save({ name });
    } catch (e) {}
  }
  async generateAlbumTags(tags: string[]): Promise<TagsDto[]> {
    const albumTags = new Map<string, TagsDto>();

    for (const tag of tags) {
      const albumTag = await this.assignTag(tag);
      if (albumTag) {
        albumTags.set(albumTag.id, albumTag);
      }
    }
    const result = Array.from(albumTags).map((el) => el[1]);
    return result;
  }

  async assignAlbumToTag(album: AlbumDto): Promise<void> {
    for (const albumTag of album.tags) {
      try {
        await this.tagsRepository.findOne(
          {
            id: albumTag.id,
          },
          { relations: ['albums'] },
        );
      } catch (e) {
        this.logService.saveLog(
          `${e}, 'assign album to tag error', ${JSON.stringify(album)}`,
          'warn',
        );
      }
    }
  }

  getAlbumIdsByTagFilter = async ({
    filter,
    idsSet,
  }: {
    filter: string[];
    idsSet: Set<string>;
  }) => {
    const tags = await this.tagsRepository.find({
      where: { id: In(filter) },
      relations: ['albums'],
    });
    const tagRelatedAlbumIds = new Set<string>();
    for (const tag of tags) {
      for (const album of tag.albums) {
        tagRelatedAlbumIds.add(album.id); // assign album to separate Set to combine and filter album ids later
      }
    }
    for (const stateAlbumId of idsSet) {
      // get album ids
      if (!tagRelatedAlbumIds.has(stateAlbumId)) {
        // check if it exists at tag related ids
        idsSet.delete(stateAlbumId); // if not - remove id from original Set
      }
    }
  };

  deleteTags = async ({ tagIds }: { tagIds: string[] }) => {
    try {
      await this.tagsRepository.delete(tagIds);
    } catch (e) {
      console.error(e);
    }
  };
}
