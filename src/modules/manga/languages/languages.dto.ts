import { AlbumDto } from '../album/album.dto';

export class PaginatedLanguageDto {
  data: LanguageDto[];
  total: number;
  currentPage: number;
}

export class LanguageDto {
  id: string;
  name: string;
  albums?: AlbumDto[];
}
