import { Controller, Get, Post, Query } from '@nestjs/common';
import { ImageDto, PaginatedImageDto } from './image.dto';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  getImages(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
  ): Promise<PaginatedImageDto> {
    return this.imageService.getImages({ page, perPage });
  }

  @Post()
  saveImage(image: ImageDto): Promise<ImageDto> {
    return this.imageService.saveImage(image);
  }
}
