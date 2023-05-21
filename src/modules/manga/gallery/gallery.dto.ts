import { AlbumDto } from '../album/album.dto';
import { UserDto } from '../../users/users.dto';

export class PaginatedGalleryDto {
  data: GalleryDto[];
  total: number;
  currentPage: number;
}

export class GalleryBodyDto {
  name: string;
  albumsIds: string[];
}

export class GalleryDto {
  id: string;

  name: string;

  maxAmount: number;

  albums?: AlbumDto[];
  user?: UserDto;
}

export class UpdateGalleryBodyDto {
  galleryId: string;
  albumId: string;
}

export class UpdateMaxAlbumAmountDto {
  galleryId: string;
  maxAmount?: number;
}
