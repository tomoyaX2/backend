import { VideoDto } from '../video/video.dto';

export class PaginatedTypeDto {
  data: TypeDto[];
  total: number;
  currentPage: number;
}

export interface TypeDto {
  id?: string;
  name: string;
  videos?: VideoDto[];
}
