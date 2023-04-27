import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HitomiFields } from 'src/shared/enums/HitomiFields';
import { In, Repository } from 'typeorm';
import { AuthorService } from '../authors/authors.service';
import { GroupService } from '../group/group.service';
import { ImageService } from '../image/image.service';
import { LanguagesService } from '../languages/languages.service';
import { SeriesService } from '../series/series.service';
import { TagsService } from '../tags/tags.service';
import { AlbumDto, PaginatedAlbumDto, RecommendationsDto } from './album.dto';
import { Album } from './album.entity';
import { TypeService } from '../type/type.service';
import { LogService } from '../log/log.service';
import { AlbumPaginationQuery, DefaultPaginationQuery } from 'src/shared/types';
import { buildStrictPagination } from './utils/search';
import * as _ from 'lodash';
import { BlockedAlbumService } from '../blocked/blocked.service';
import { UsersService } from '../users/users.service';
import { RateService } from '../rate/rate.service';
import { albumRelations } from 'src/shared/constants';
import { appendRate } from './utils/appendRate';

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
    private usersService: UsersService,
    private rateService: RateService,
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

  async getAlbumById(
    id: string,
    ignoreViews = false,
    relations: string[] = albumRelations,
  ): Promise<AlbumDto> {
    const album = await this.albumRepository.findOne({
      relations,
      where: { id },
    });
    if (!album) {
      throw new NotFoundException({ message: 'Album not found' });
    }
    if (!ignoreViews) {
      album.views = album.views + 1;
      this.albumRepository.save(album);
    }
    return {
      ...album,
      rate: album?.rate || 0,
      images: _.orderBy(album.images, ['url']),
    };
  }

  async getPlainAlbumById(id: string): Promise<AlbumDto> {
    const album = await this.albumRepository.findOne({
      where: { id },
    });
    if (!album) {
      throw new NotFoundException({ message: 'Album not found' });
    }
    return album;
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

  async searchAlbums(albumParams: AlbumPaginationQuery): Promise<any> {
    const [data, total] = await buildStrictPagination(
      albumParams,
      this.albumRepository,
      this.tagsService,
      this.authorsService,
      this.seriesService,
      this.languageService,
      this.groupService,
    );
    //TODO: make with sql query
    return {
      data: appendRate(data as AlbumDto[]) ?? [],
      total,
      currentPage: albumParams.page,
    } as any;
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

  getRateAlbum = async ({ albumId, userId }) => {
    const album = await this.albumRepository.findOne(
      { id: albumId },
      { relations: ['rates'] },
    );
    const user = await this.usersService.getUserById(userId, ['rates']);
    const result = await this.rateService.getRate({ album, user });
    return result;
  };

  setRateAlbum = async ({ albumId, userId, rate }) => {
    const album = await this.albumRepository.findOne(
      { id: albumId },
      { relations: ['rates'] },
    );
    const user = await this.usersService.getUserById(userId, ['rates']);
    await this.rateService.saveRate({ album, user, rate });
  };

  getAlbumRecomendations = async ({
    albumId,
  }: {
    albumId: string;
  }): Promise<RecommendationsDto> => {
    const currentAlbum = await this.albumRepository.findOne(albumId, {
      relations: ['authors', 'series'],
    });
    const sameAuthor = await this.albumRepository
      .createQueryBuilder('album')
      .leftJoin('album.authors', 'author')
      .leftJoin('album.rates', 'rate')
      .where('author.id IN (:...authorIds)', {
        authorIds: currentAlbum.authors.map((el) => el.id),
      })
      .take(10)
      .getMany();
    const sameSeries = await this.albumRepository
      .createQueryBuilder('album')
      .leftJoin('album.series', 'series')
      .leftJoin('album.rates', 'rate')
      .where('series.id IN (:...seriesIds)', {
        seriesIds: currentAlbum.series,
      })
      .take(10)
      .getMany();
    return {
      sameAuthor: appendRate(sameAuthor),
      sameSeries: appendRate(sameSeries),
    };
  };
}
