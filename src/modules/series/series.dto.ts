import { AlbumDto } from '../album/album.dto';

export class PaginatedSeriesDto {
  data: SeriesDto[];
  total: number;
  currentPage: number;
}

export class SeriesDto {
  id: string;
  name: string;
  albums: AlbumDto[];
}
