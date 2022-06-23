import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { LanguageDto, PaginatedLanguageDto } from './languages.dto';
import { LanguagesService } from './languages.service';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languageService: LanguagesService) {}

  @ApiQuery({
    name: 'withAlbums',
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
    @Query('withAlbums') withAlbums: string,
  ): Promise<PaginatedLanguageDto> {
    return this.languageService.getLanguages({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
      withAlbums: withAlbums == 'true',
    });
  }

  @Post()
  createLanguage(@Body() language: LanguageDto): Promise<LanguageDto> {
    return this.languageService.createLanguage(language);
  }
}
