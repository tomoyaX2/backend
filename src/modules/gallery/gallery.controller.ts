import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import {
  GalleryBodyDto,
  GalleryDto,
  UpdateGalleryBodyDto,
} from './gallery.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/auth.guard';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get()
  getGallery(@Req() req): Promise<GalleryDto[]> {
    return this.galleryService.getGallery(req.sub);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Post()
  createGallery(
    @Body() gallery: GalleryBodyDto,
    @Req() req,
  ): Promise<GalleryDto> {
    return this.galleryService.createGallery(gallery, req.sub);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Patch('add-album')
  updateGallery(@Body() body: UpdateGalleryBodyDto): Promise<void> {
    return this.galleryService.addAlbumToGallery(body);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Patch('remove-album')
  removeAlbum(@Body() body: UpdateGalleryBodyDto): Promise<void> {
    return this.galleryService.removeAlbumFromGallery(body);
  }
}
