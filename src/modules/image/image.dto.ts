import { Album } from '../album/album.entity';

export class PaginatedImageDto {
  data: ImageDto[];
  total: number;
  currentPage: number;
}

export interface ImageDto {
  id?: string;
  name?: string;
  url?: string;
  album?: Album;
}
