import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HitomiFields } from 'src/shared/enums/HitomiFields';
import { Repository } from 'typeorm';
import { AuthorService } from '../authors/authors.service';
import { GroupService } from '../group/group.service';
import { ImageService } from '../image/image.service';
import { LanguagesService } from '../languages/languages.service';
import { SeriesService } from '../series/series.service';
import { TagsService } from '../tags/tags.service';
import { AlbumDto, PaginatedAlbumDto } from './album.dto';
import { Album } from './album.entity';
import { TypeService } from '../type/type.service';
import { LogService } from '../log/log.service';
import { AlbumPaginationQuery, DefaultPaginationQuery } from 'src/shared/types';
import { buildStrictPagination } from './utils';
import * as _ from 'lodash';
import { BlockedAlbumService } from '../blocked/blocked.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<AlbumDto>,
    private authorsService: AuthorService,
    private groupService: GroupService,
    private languageService: LanguagesService,
    private seriesService: SeriesService,
    private tagsService: TagsService,
    private imageService: ImageService,
    private typeService: TypeService,
    private logService: LogService,
    private blockedAlbumService: BlockedAlbumService,
  ) {}

  async getAlbums({
    page,
    perPage,
  }: DefaultPaginationQuery): Promise<PaginatedAlbumDto> {
    const [data, total] = await this.albumRepository.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage,
    });
    return { data, total, currentPage: page };
  }

  async getAlbumById(id: string, ignoreViews = false): Promise<AlbumDto> {
    const album = await this.albumRepository.findOne({
      relations: [
        'authors',
        'series',
        'language',
        'group',
        'tags',
        'comments',
        'type',
      ],
      where: { id },
    });
    if (!album) {
      throw new NotFoundException({ message: 'Album not found' });
    }

    if (!ignoreViews) {
      album.views = album.views + 1;
    }
    this.albumRepository.save(album);
    return { ...album, images: _.orderBy(album.images, ['url']) };
  }

  async getAlbumForScrapperFilter(
    where: Record<string, string>,
  ): Promise<boolean> {
    const album = await this.albumRepository.findOne({
      relations: ['language'],
      where,
    });
    return !!album;
  }

  async searchAlbums(
    albumParams: AlbumPaginationQuery,
  ): Promise<PaginatedAlbumDto> {
    const [data, total] = await buildStrictPagination(
      albumParams,
      this.albumRepository,
    );
    return { data: data ?? [], total, currentPage: albumParams.page } as any;
  }

  async createAlbum(album: AlbumDto): Promise<AlbumDto> {
    const result = await this.albumRepository.save(album);
    return result;
  }

  async updateAlbum(album: AlbumDto) {
    const result = await this.albumRepository.save(album);
    return result;
  }

  async generateAlbum({
    albumData,
    albumPath,
  }: {
    albumData: Record<
      | HitomiFields
      | 'downloadPath'
      | 'totalImages'
      | 'preview'
      | 'previewOrientation',
      any
    >;
    albumPath: string;
  }): Promise<string> {
    const {
      title,
      authors,
      group,
      languages,
      series,
      tags,
      images,
      type,
      downloadPath,
      totalImages,
      preview,
      previewOrientation,
    } = albumData;
    const album = await this.createAlbum({ title: title[0], totalImages });

    album.path = albumPath;
    if (authors.length) {
      const result = await this.authorsService.assignAuthorToAlbum(authors);
      album.authors = result;
    }
    if (tags.length) {
      const albumTags = await this.tagsService.generateAlbumTags(tags);
      album.tags = albumTags;
    }
    if (series.length) {
      const albumSeries = await this.seriesService.assignSeries(series[0]);
      album.series = albumSeries;
    }
    if (group.length) {
      const albumGroup = await this.groupService.assignGroup(group[0]);
      album.group = albumGroup;
    }
    if (languages.length) {
      const albumLanguage = await this.languageService.assignLanguage(
        languages[0],
      );
      album.language = albumLanguage;
    }
    if (images.length) {
      const albumImages = await this.imageService.assignImageToAlbum(images);
      album.images = albumImages;
    }
    const albumType = await this.typeService.assignType(type[0]);

    album.type = albumType;
    album.previewOrientation = previewOrientation;
    album.downloadPath = downloadPath;
    album.preview = preview;
    album.views = 0;
    const finalAlbum = await this.albumRepository.save(album);
    tags.length && (await this.tagsService.assignAlbumToTag(finalAlbum));
    images.length && (await this.imageService.assignAlbumToImage(finalAlbum));
    authors.length &&
      (await this.authorsService.assignAlbumToAuthor(finalAlbum));
    return finalAlbum.id;
  }

  async updateAlbumImagesById({
    images,
    albumId,
  }: {
    images: { url: string; width: number; height: number }[];
    albumId: string;
  }): Promise<void> {
    const album = await this.albumRepository.findOne({
      relations: ['images'],
      where: { id: albumId },
    });
    const albumImages = await this.imageService.assignImageToAlbum(images);
    album.images = [...(album?.images || []), ...albumImages];
    const finalAlbum = await this.albumRepository.save(album);
    await this.imageService.assignAlbumToImage(finalAlbum);
  }

  deleteAlbumById = async (id: string) => {
    const album = await this.albumRepository.findOne({ id });
    await this.blockedAlbumService.blockAlbum({ name: album.title });
    return this.albumRepository.delete(id);
  };
}
