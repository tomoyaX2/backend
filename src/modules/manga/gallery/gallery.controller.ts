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
  UpdateMaxAlbumAmountDto,
} from './gallery.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../auth/auth.guard';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Get()
  getGalleries(@Req() req): Promise<GalleryDto[]> {
    return this.galleryService.getGalleries(req.sub);
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
  @Patch('update-amount')
  updateAmount(@Body() body: UpdateMaxAlbumAmountDto): Promise<GalleryDto> {
    return this.galleryService.changeMaxAlbumsAmount(body);
  }

  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
  @Patch('remove-album')
  removeAlbum(@Body() body: UpdateGalleryBodyDto): Promise<void> {
    return this.galleryService.removeAlbumFromGallery(body);
  }
}
