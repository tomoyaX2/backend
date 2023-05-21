import { VideoDto } from '../video/video.dto';

export class PaginatedTagsDto {
  data: TagsDto[];
  total: number;
  currentPage: number;
}

export class TagsDto {
  id?: string;
  name: string;
  videos?: VideoDto[];
  videosCount?: number;
}
