import { UserDto } from 'src/modules/users/users.dto';
import { VideoDto } from '../video/video.dto';

export class PaginatedCommentDto {
  data: CommentDto[];
  total: number;
  currentPage: number;
}

export class CommentDto {
  id: string;
  text: string;
  author: UserDto;
  video: VideoDto;
}

export class CommentBodyDto {
  text: string;
  videoId: string;
}

export class DeleteCommentDto {
  videoId: string;
  commentId: string;
}
