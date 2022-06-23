import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthorService } from './authors.service';
import { AuthorDto, PaginatedAuthorDto } from './authors.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

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
  getAuthors(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('name') name: string,
    @Query('withAlbums') withAlbums: string,
  ): Promise<PaginatedAuthorDto> {
    return this.authorService.getAuthors({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
      withAlbums: withAlbums == 'true',
    });
  }

  @Post()
  createAuthors(@Body() author: AuthorDto): Promise<AuthorDto> {
    return this.authorService.createAuthor(author);
  }
}
