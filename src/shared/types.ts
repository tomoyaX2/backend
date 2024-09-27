import { Sort } from 'src/modules/manga/album/album.dto';
import { AlbumFilters } from './enums/AlbumFilters';

export enum SelectorTypes {
  List = 'list',
  String = 'string',
  Images = 'images',
}

export interface SelectorArgs {
  selector: string;
  textFormatter?: (text: string) => string;
  type: SelectorTypes;
}

export interface DefaultPaginationQuery {
  page?: number;
  perPage?: number;
  withAlbums?: boolean;
  withVideos?: boolean;
  [AlbumFilters.Name]?: string;
  title?: string;
}

export interface CommentsPaginationQuery extends DefaultPaginationQuery {
  albumId?: string;
  videoId?: string;
}

export interface AlbumPaginationQuery extends DefaultPaginationQuery {
  [AlbumFilters.Author]?: string[];
  [AlbumFilters.Series]?: string[];
  [AlbumFilters.Language]?: string[];
  [AlbumFilters.Group]?: string[];
  [AlbumFilters.Tag]?: string[];
  [AlbumFilters.Type]?: string[];
  [AlbumFilters.Title]?: string;
  [AlbumFilters.SortBy]: Sort;
}
