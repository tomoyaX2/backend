import {
  Body,
  Controller,
  Delete,
  Get,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { StudioDto, PaginatedStudioDto } from './studio.dto';
import { StudioService } from './studio.service';
import { AccessTokenGuard } from '../../auth/auth.guard';

@Controller('video-studios')
export class StudioController {
  constructor(private readonly studioService: StudioService) {}

  @ApiQuery({
    name: 'withVideos',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @Get()
  getStudios(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('name') name: string,
    @Query('withVideos') withVideos: string,
  ): Promise<PaginatedStudioDto> {
    return this.studioService.getStudios({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
      withVideos: withVideos == 'true',
    });
  }

  @Post()
  createStudio(@Body() studio: StudioDto): Promise<StudioDto> {
    return this.studioService.createStudio(studio);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiQuery({
    name: 'studioIds',
    type: [String],
    required: true,
  })
  deleteStudio(
    @Query('studioIds', ParseArrayPipe) studioIds: string[],
  ): Promise<void> {
    return this.studioService.deleteStudios({ studioIds });
  }
}
