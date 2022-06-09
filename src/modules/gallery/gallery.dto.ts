import { AlbumDto } from '../album/album.dto';

export class PaginatedGalleryDto {
  data: GalleryDto[];
  total: number;
  currentPage: number;
}

export interface GalleryDto {
  id?: string;
  name: string;
  albums: AlbumDto[];
}
