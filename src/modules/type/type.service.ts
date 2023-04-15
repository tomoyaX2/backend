import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { albumRelations } from 'src/shared/constants';
import { DefaultPaginationQuery } from 'src/shared/types';
import { In, Like, Repository } from 'typeorm';
import { AlbumDto } from '../album/album.dto';
import { LogService } from '../log/log.service';
import { PaginatedTypeDto, TypeDto } from './type.dto';
import { Type } from './type.entity';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private typesRepository: Repository<TypeDto>,
    private logService: LogService,
  ) {}

  async getTypes({
    page,
    perPage,
    name,
    withAlbums,
  }: DefaultPaginationQuery): Promise<PaginatedTypeDto> {
    const [data, total] = await this.typesRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withAlbums ? albumRelations : [],
      take: perPage,
      skip: (page - 1) * perPage,
      order: { name: 'ASC' },
    });
    return { data, total, currentPage: page };
  }

  async createType(type: TypeDto): Promise<TypeDto> {
    try {
      return await this.typesRepository.save(type);
    } catch (e) {}
  }

  async assignType(name: string) {
    try {
      const type = await this.typesRepository.findOne({ name });
      if (type?.name) {
        return type;
      }
      return await this.typesRepository.save({ name });
    } catch (e) {}
  }

  async assignAlbumToType(album: AlbumDto): Promise<void> {
    try {
      const targetType = await this.typesRepository.findOne(
        {
          id: album.type.id,
        },
        { relations: ['albums'] },
      );
      await this.typesRepository.save({
        ...targetType,
        albums: [...(targetType?.albums || []), album],
      });
    } catch (e) {
      this.logService.saveLog(
        `${e}, 'assign album to tag error', ${JSON.stringify(album)}`,
        'warn',
      );
    }
  }

  getAlbumIdsByTypesFilter = async ({
    filter,
    idsSet,
    avoidIdsSet,
  }: {
    filter: string[];
    idsSet: Set<string>;
    avoidIdsSet: Set<string>;
  }) => {
    const types = await this.typesRepository.find({
      where: { id: In(filter) },
      relations: ['albums'],
    });
    const typesRelatedAlbumIds = new Set<string>();
    for (const type of types) {
      for (const album of type.albums) {
        typesRelatedAlbumIds.add(album.id); // assign album to separate Set to combine and filter album ids later
      }
    }
    for (const stateAlbumId of idsSet) {
      // get album ids
      if (
        !typesRelatedAlbumIds.has(stateAlbumId) ||
        avoidIdsSet.has(stateAlbumId)
      ) {
        // check if it exists at tag related ids
        idsSet.delete(stateAlbumId); // if not - remove id from original Set
      }
    }
  };

  deleteTypes = async ({ typeIds }: { typeIds: string[] }) => {
    try {
      await this.typesRepository.delete(typeIds);
    } catch (e) {
      console.error(e);
    }
  };
}
