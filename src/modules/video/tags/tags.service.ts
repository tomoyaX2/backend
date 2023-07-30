import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultPaginationQuery } from 'src/shared/types';
import { In, Like, Repository } from 'typeorm';
import { VideoDto } from '../video/video.dto';
import { LogService } from '../../log/log.service';
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
    withVideos,
  }: DefaultPaginationQuery): Promise<PaginatedTagsDto> {
    const [data, total] = await this.tagsRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withVideos ? ['videos'] : [],
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

  async assignTag(name: string, video?: VideoDto): Promise<TagsDto> {
    try {
      const tag = await this.tagsRepository.findOne(
        {
          name,
        },
        { relations: ['videos'] },
      );
      if (tag?.name) {
        const result = await this.tagsRepository.save({
          ...tag,
          videos: video ? [...tag.videos, video] : tag.videos,
          videosCount: tag.videosCount + 1,
        });
        return await this.tagsRepository.findOne({ id: result.id });
      }
      const result = await this.tagsRepository.save({
        name,
        videos: video ? [video] : [],
        videosCount: video ? 1 : 0,
      });
      return await this.tagsRepository.findOne({ id: result.id });
    } catch (e) {}
  }
  async generateVideoTags(tags: string[]): Promise<TagsDto[]> {
    const videoTags = new Map<string, TagsDto>();

    for (const tag of tags) {
      const videoTag = await this.assignTag(tag);
      if (videoTag) {
        videoTags.set(videoTag.id, videoTag);
      }
    }
    const result = Array.from(videoTags).map((el) => el[1]);
    return result;
  }

  async assignVideoToTag(video: VideoDto): Promise<void> {
    for (const videoTag of video.tags) {
      try {
        const targetTag = await this.tagsRepository.findOne(
          {
            id: videoTag.id,
          },
          { relations: ['videos'] },
        );
        if (targetTag.videos.every((el) => el.id !== video.id)) {
          await this.tagsRepository.save({
            ...targetTag,
            videosCount: targetTag?.videosCount + 1 || 1,
            videos: [...(targetTag?.videos || []), video],
          });
        }
      } catch (e) {
        this.logService.saveLog(
          `${e}, 'assign video to tag error', ${JSON.stringify(video)}`,
          'warn',
        );
      }
    }
  }

  getVideoIdsByTagFilter = async ({
    filter,
    idsSet,
  }: {
    filter: string[];
    idsSet: Set<string>;
  }) => {
    const tags = await this.tagsRepository.find({
      where: { id: In(filter) },
      relations: ['videos'],
    });
    const tagRelatedVideoIds = new Set<string>();
    for (const tag of tags) {
      for (const video of tag.videos) {
        tagRelatedVideoIds.add(video.id); // assign video to separate Set to combine and filter video ids later
      }
    }
    for (const stateVideoId of idsSet) {
      // get video ids
      if (!tagRelatedVideoIds.has(stateVideoId)) {
        // check if it exists at tag related ids
        idsSet.delete(stateVideoId); // if not - remove id from original Set
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

  onRemoveVideo = async ({ tagId }: { tagId: string }) => {
    const tag = await this.tagsRepository.findOne(tagId);
    tag.videosCount = tag.videosCount === 0 ? 0 : tag.videosCount - 1;
    await this.tagsRepository.save(tag);
  };

  getTagsByIds = async (ids: string[]) => {
    const result = await this.tagsRepository.findByIds(ids);
    return result;
  };
}
