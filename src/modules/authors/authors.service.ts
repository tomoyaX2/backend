import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { albumRelations } from 'src/shared/constants';
import { DefaultPaginationQuery } from 'src/shared/types';
import { Like, Repository } from 'typeorm';
import { AlbumDto } from '../album/album.dto';
import { LogService } from '../log/log.service';
import { AuthorDto, PaginatedAuthorDto } from './authors.dto';
import { Author } from './authors.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<AuthorDto>,
    private logService: LogService,
  ) {}

  async getAuthors({
    page,
    perPage,
    name,
    withAlbums,
  }: DefaultPaginationQuery): Promise<PaginatedAuthorDto> {
    const [data, total] = await this.authorRepository.findAndCount({
      where: name ? { name: Like('%' + name + '%') } : {},
      relations: withAlbums ? albumRelations : [],
      take: perPage,
      skip: (page - 1) * perPage,
    });
    return { data, total, currentPage: page };
  }

  async createAuthor(author: AuthorDto): Promise<AuthorDto> {
    try {
      return await this.authorRepository.save(author);
    } catch (e) {}
  }

  async assignAuthor(name: string): Promise<AuthorDto> {
    try {
      const author = await this.authorRepository.findOne({ name });
      if (author?.name) {
        return author;
      }
      return await this.authorRepository.save({ name });
    } catch (e) {}
  }

  async assignAuthorToAlbum(authors: string[]): Promise<AuthorDto[]> {
    const albumAuthors: AuthorDto[] = [];
    for (const author of authors) {
      const albumAuthor = await this.assignAuthor(author);
      albumAuthors.push(albumAuthor);
    }
    return albumAuthors;
  }

  async assignAlbumToAuthor(album: AlbumDto): Promise<void> {
    for (const albumAuthor of album.authors) {
      try {
        const targetAuthor = await this.authorRepository.findOne({
          id: albumAuthor.id,
        });
        await this.authorRepository.save({
          ...targetAuthor,
          albums: [...(targetAuthor?.albums || []), album],
        });
      } catch (e) {
        this.logService.saveLog(
          `${e}, 'assign album to author error', ${album}`,
          'warn',
        );
      }
    }
  }
}
