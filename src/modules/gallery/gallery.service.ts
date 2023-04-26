import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumService } from '../album/album.service';
import { UsersService } from '../users/users.service';
import {
  GalleryBodyDto,
  GalleryDto,
  UpdateMaxAlbumAmountDto,
} from './gallery.dto';
import { Gallery } from './gallery.entity';
import { Errors } from 'src/errors/auth';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<GalleryDto>,
    private albumService: AlbumService,
    private usersService: UsersService,
  ) {}

  async getGalleries(userId: string): Promise<GalleryDto[]> {
    const gallery = await this.galleryRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'albums'],
    });
    return gallery;
  }

  async createGallery(
    gallery: GalleryBodyDto,
    userId: string,
  ): Promise<GalleryDto> {
    const newGallery = await this.galleryRepository.save({
      name: gallery.name,
      maxAmount: 20,
    });
    const user = await this.usersService.getUserById(userId);
    if (gallery?.albumsIds) {
      for (const albumId of gallery.albumsIds) {
        const album = await this.albumService.getPlainAlbumById(albumId);
        newGallery.albums = [...(newGallery.albums || []), album];
      }
    }
    newGallery.user = user;
    return await this.galleryRepository.save(newGallery);
  }

  async addAlbumToGallery({
    albumId,
    galleryId,
  }: {
    albumId: string;
    galleryId: string;
  }): Promise<void> {
    const gallery = await this.galleryRepository.findOne(
      { id: galleryId },
      { relations: ['albums'] },
    );
    if (!gallery.maxAmount) {
      gallery.maxAmount = 20;
    }

    const album = await this.albumService.getAlbumById(albumId);

    if (gallery.maxAmount >= gallery.albums.length + 1) {
      gallery.albums = [...gallery.albums, album];
    } else {
      gallery.albums[0] = album;
    }
    this.galleryRepository.save(gallery);
  }

  async removeAlbumFromGallery({
    albumId,
    galleryId,
  }: {
    albumId: string;
    galleryId: string;
  }): Promise<void> {
    const gallery = await this.galleryRepository.findOne(
      { id: galleryId },
      { relations: ['albums'] },
    );
    gallery.albums = gallery.albums.filter((el) => el.id !== albumId);
    this.galleryRepository.save(gallery);
  }

  changeMaxAlbumsAmount = async ({
    maxAmount,
    galleryId,
  }: UpdateMaxAlbumAmountDto): Promise<GalleryDto> => {
    const gallery = await this.galleryRepository.findOne(
      { id: galleryId },
      { relations: ['albums'] },
    );
    if (gallery.albums.length >= maxAmount) {
      throw new BadRequestException({
        message: { emailExists: Errors.gallery.maxAlbumsAmount },
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
    gallery.maxAmount = maxAmount;
    return this.galleryRepository.save(gallery);
  };
}
