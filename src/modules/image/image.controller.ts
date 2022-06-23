import { Controller, Post } from '@nestjs/common';
import { ImageDto } from './image.dto';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  saveImage(image: ImageDto): Promise<ImageDto> {
    return this.imageService.saveImage(image);
  }
}
