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
import { LanguageDto, PaginatedLanguageDto } from './languages.dto';
import { LanguagesService } from './languages.service';
import { AccessTokenGuard } from '../../auth/auth.guard';

@Controller('video-languages')
export class LanguagesController {
  constructor(private readonly languageService: LanguagesService) {}

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
  getLanguages(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('name') name: string,
    @Query('withVideos') withVideos: string,
  ): Promise<PaginatedLanguageDto> {
    return this.languageService.getLanguages({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
      withVideos: withVideos == 'true',
    });
  }

  @Post()
  createLanguage(@Body() language: LanguageDto): Promise<LanguageDto> {
    return this.languageService.createLanguage(language);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiQuery({
    name: 'languagesId',
    type: [String],
    required: true,
  })
  deleteSeries(
    @Query('languagesId', ParseArrayPipe) languagesId: string[],
  ): Promise<void> {
    return this.languageService.deleteLanguages({ languagesId });
  }
}
