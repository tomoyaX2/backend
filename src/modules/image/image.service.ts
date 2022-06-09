import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImageDto, PaginatedImageDto } from './image.dto';
import { Image } from './image.entity';
import { LogService } from '../log/log.service';
import { DefaultPaginationQuery } from 'src/shared/types';
import { albumRelations } from 'src/shared/constants';
import { AlbumDto } from '../album/album.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private imagesRepository: Repository<Image>,
    private logService: LogService,
  ) {}

  async getImages({
    page,
    perPage,
  }: DefaultPaginationQuery): Promise<PaginatedImageDto> {
    const [data, total] = await this.imagesRepository.findAndCount({
      relations: albumRelations,
      take: perPage,
      skip: (page - 1) * perPage,
    });
    return { data, total, currentPage: page };
  }

  async saveImage(image: ImageDto): Promise<Image> {
    return await this.imagesRepository.save(image);
  }

  async assignImageToAlbum(images: string[]) {
    const albumImages: Image[] = [];
    for (const image of images) {
      const adImage = await this.saveImage({});
      if (image) {
        const albumImage = await this.saveImage({
          ...adImage,
          url: image,
          name: adImage.id,
        });
        albumImages.push(albumImage);
      }
    }
    return albumImages;
  }

  async assignAlbumToImage(album: AlbumDto): Promise<void> {
    for (const albumImage of album.images) {
      try {
        await this.imagesRepository.save({ ...albumImage, album });
      } catch (e) {
        this.logService.saveLog(
          `${e}, 'assign album to image error', ${JSON.stringify(album)}`,
          'warn',
        );
      }
    }
  }
}
