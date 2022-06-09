import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GalleryDto } from './gallery.dto';
import { Gallery } from './gallery.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  getGallery(userId: string): Promise<Gallery[]> {
    return this.galleryRepository.find({ where: { user: { id: userId } } });
  }

  async createGallery(gallery: GalleryDto): Promise<Gallery> {
    return await this.galleryRepository.save(gallery);
  }
}
