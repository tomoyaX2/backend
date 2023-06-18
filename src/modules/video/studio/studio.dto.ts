import { VideoDto } from '../video/video.dto';

export class PaginatedStudioDto {
  data: StudioDto[];
  total: number;
  currentPage: number;
}

export class StudioDto {
  id: string;
  name: string;
  videos?: VideoDto[];
}
