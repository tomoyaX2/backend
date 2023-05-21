import { UserDto } from 'src/modules/users/users.dto';
import { AlbumDto } from '../album/album.dto';

export class PaginatedCommentDto {
  data: CommentDto[];
  total: number;
  currentPage: number;
}

export class CommentDto {
  id: string;
  text: string;
  author: UserDto;
  album: AlbumDto;
}

export class CommentBodyDto {
  text: string;
  albumId: string;
}

export class DeleteCommentDto {
  albumId: string;
  commentId: string;
}
