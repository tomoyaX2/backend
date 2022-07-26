import { Controller, Post, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ImageDto, PaginatedImageDto } from './image.dto';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'perPage',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'albumId',
    type: String,
    required: true,
  })
  getImages(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('albumId') albumId: string,
  ): Promise<PaginatedImageDto> {
    return this.imageService.getImages({ page, perPage, albumId });
  }

  @Post()
  saveImage(image: ImageDto): Promise<ImageDto> {
    return this.imageService.saveImage(image);
  }
}
