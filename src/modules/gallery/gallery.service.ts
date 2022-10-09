import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlbumService } from '../album/album.service';
import { UsersService } from '../users/users.service';
import { GalleryBodyDto, GalleryDto } from './gallery.dto';
import { Gallery } from './gallery.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<GalleryDto>,
    private albumService: AlbumService,
    private usersService: UsersService,
  ) {}

  async getGallery(userId: string): Promise<GalleryDto[]> {
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
    });
    const user = await this.usersService.getUserById(userId);
    for (const albumId of gallery.albumsIds) {
      const album = await this.albumService.getPlainAlbumById(albumId);
      newGallery.albums = [...(newGallery.albums || []), album];
    }
    newGallery.user = user;
    return await this.galleryRepository.save(newGallery);
  }
}
