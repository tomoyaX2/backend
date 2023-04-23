import { AlbumDto } from '../album/album.dto';

export class PaginatedTagsDto {
  data: TagsDto[];
  total: number;
  currentPage: number;
}

export class TagsDto {
  id?: string;
  name: string;
  albums?: AlbumDto[];
  albumsCount?: number;
}
