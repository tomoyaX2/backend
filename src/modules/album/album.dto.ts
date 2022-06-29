import { AuthorDto } from '../authors/authors.dto';
import { CommentDto } from '../comments/comments.dto';
import { GalleryDto } from '../gallery/gallery.dto';
import { GroupDto } from '../group/group.dto';
import { ImageDto } from '../image/image.dto';
import { LanguageDto } from '../languages/languages.dto';
import { SeriesDto } from '../series/series.dto';
import { TagsDto } from '../tags/tags.dto';
import { TypeDto } from '../type/type.dto';

export interface Sort {
  views?: 'DESC';
  rate?: 'DESC';
}

export class PaginatedAlbumDto {
  data: AlbumDto[];
  total: number;
  currentPage: number;
}

export class AlbumDto {
  id?: string;
  title?: string;
  gallery?: GalleryDto;
  images?: ImageDto[];
  authors?: AuthorDto[];
  series?: SeriesDto;
  language?: LanguageDto;
  group?: GroupDto;
  tags?: TagsDto[];
  path?: string;
  type?: TypeDto;
  views?: number;
  rate?: number;
  comments?: CommentDto[];
  preview?: string;
  downloadPath?: string;
  totalImages?: number;
}

export class SearchDto {
  page: string;
  perPage: string;
  title: string;
  tags: string[];
  authors: string[];
  series: string[];
  languages: string[];
  groups: string[];
  types: string[];
  sortBy: Sort;
}
