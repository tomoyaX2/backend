import { AlbumDto } from '../album/album.dto';

export class PaginatedGroupDto {
  data: GroupDto[];
  total: number;
  currentPage: number;
}

export class GroupDto {
  id: string;
  name: string;
  albums?: AlbumDto[];
}
