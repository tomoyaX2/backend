import { AlbumDto } from '../album/album.dto';

export class PaginatedAuthorDto {
  data: AuthorDto[];
  total: number;
  currentPage: number;
}

export class AuthorDto {
  id: string;
  name: string;
  albums?: AlbumDto[];
}
