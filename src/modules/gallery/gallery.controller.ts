import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { Gallery } from './gallery.entity';
import { GalleryDto } from './gallery.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/auth.guard';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get()
  getGallery(@Req() req): Promise<Gallery[]> {
    return this.galleryService.getGallery(req.sub);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Post()
  createGallery(gallery: GalleryDto): Promise<Gallery> {
    return this.galleryService.createGallery(gallery);
  }
}
