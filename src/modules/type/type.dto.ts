import { AlbumDto } from '../album/album.dto';

export class PaginatedTypeDto {
  data: TypeDto[];
  total: number;
  currentPage: number;
}

export interface TypeDto {
  id?: string;
  name: string;
  albums?: AlbumDto[];
}
