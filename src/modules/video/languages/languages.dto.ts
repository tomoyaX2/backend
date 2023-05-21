import { VideoDto } from '../video/video.dto';

export class PaginatedLanguageDto {
  data: LanguageDto[];
  total: number;
  currentPage: number;
}

export class LanguageDto {
  id: string;
  name: string;
  videos?: VideoDto[];
}
