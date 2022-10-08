import { CommentDto } from '../comments/comments.dto';

export class PaginatedUsersDto {
  data: UserDto[];
  total: number;
  currentPage: number;
}

export class UserDto {
  id?: string;
  login: string;
  password?: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  access_token?: string;
  refresh_token?: string;
  recovery_code?: string;
  next_recovery_request_in?: string;
  comments?: CommentDto[];
}
