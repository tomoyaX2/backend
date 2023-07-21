import { CommentDto } from '../comments/comments.dto';
import { EpisodeDto } from '../episode/episode.dto';
import { LanguageDto } from '../languages/languages.dto';
import { StudioDto } from '../studio/studio.dto';
import { TagsDto } from '../tags/tags.dto';
import { TypeDto } from '../type/type.dto';

export interface Sort {
  views?: 'DESC';
  rate?: 'DESC';
}

export class PaginatedVideoDto {
  data: VideoDto[];
  total: number;
  currentPage: number;
}

export class VideoDto {
  id?: string;
  title?: string;
  coverImageUrl?: string;
  tags?: TagsDto[];
  releaseDate?: string;
  path?: string;
  type?: TypeDto;
  description?: string;
  views?: number;
  language: LanguageDto;
  rate?: number;
  studios: StudioDto[];
  comments?: CommentDto[];
  episodes?: EpisodeDto[];
  rates?: RateDto[];
  created_date?: Date;
  updated_date?: Date;
}

export class SearchDto {
  page: number;
  perPage: number;
  title?: string;
  tags?: string[];
  series?: string[];
  languages?: string[];
  groups?: string[];
  types?: string[];
  sortBy?: Sort;
}

export class RateDto {
  id?: string;
  rate: number;
}

export class ScrapperDto {
  id: string;
  title: string;
  coverImageUrl: string;
  description: string;
  releaseDate: string;
  type: string;
  language: string;
  studios: string[];
  tags: string[];
}

export class ScrapperWithEpisodes {
  episodes?: {
    id: string;
    url: string;
    episode: number;
    availableQuality: string[];
  }[];
}
