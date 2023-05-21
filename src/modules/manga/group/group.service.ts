import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { albumRelations } from 'src/shared/constants';
import { DefaultPaginationQuery } from 'src/shared/types';
import { In, Like, Repository } from 'typeorm';
import { Album } from '../album/album.entity';
import { LogService } from '../../log/log.service';
import { GroupDto, PaginatedGroupDto } from './group.dto';
import { Group } from './group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<GroupDto>,
    private logService: LogService,
  ) {}

  async getGroups({
    page,
    perPage,
    name,
    withAlbums,
  }: DefaultPaginationQuery): Promise<PaginatedGroupDto> {
    const [data, total] = await this.groupRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withAlbums ? albumRelations : [],
      take: perPage,
      skip: (page - 1) * perPage,
    });
    return { data, total, currentPage: page };
  }

  async createGroup(group: GroupDto): Promise<GroupDto> {
    try {
      return await this.groupRepository.save(group);
    } catch (e) {}
  }

  async assignGroup(name: string): Promise<GroupDto> {
    try {
      const group = await this.groupRepository.findOne({ name });
      if (group?.name) {
        return group;
      }
      return await this.groupRepository.save({ name });
    } catch (e) {}
  }

  async assignAlbumToGroup(album: Album): Promise<void> {
    try {
      const targetGroup = await this.groupRepository.findOne(
        {
          id: album.group.id,
        },
        { relations: ['albums'] },
      );
      await this.groupRepository.save({
        ...targetGroup,
        albums: [...(targetGroup?.albums || []), album],
      });
    } catch (e) {
      this.logService.saveLog(
        `${e}, 'assign album to group error', ${JSON.stringify(album)}`,
        'warn',
      );
    }
  }

  getAlbumIdsByGroupFilter = async ({
    filter,
    idsSet,
  }: {
    filter: string[];
    idsSet: Set<string>;
  }) => {
    const groups = await this.groupRepository.find({
      where: { id: In(filter) },
      relations: ['albums'],
    });
    const groupsRelatedAlbumIds = new Set<string>();
    for (const group of groups) {
      for (const album of group.albums) {
        groupsRelatedAlbumIds.add(album.id); // assign album to separate Set to combine and filter album ids later
      }
    }
    for (const stateAlbumId of idsSet) {
      // get album ids
      if (!groupsRelatedAlbumIds.has(stateAlbumId)) {
        // check if it exists at tag related ids
        idsSet.delete(stateAlbumId); // if not - remove id from original Set
      }
    }
  };

  deleteGroup = async ({ groupIds }: { groupIds: string[] }) => {
    try {
      await this.groupRepository.delete(groupIds);
    } catch (e) {
      console.error(e);
    }
  };
}
