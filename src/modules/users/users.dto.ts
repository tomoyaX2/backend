import { CommentDto } from '../manga/comments/comments.dto';
import { RateDto } from '../manga/rate/rate.dto';

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
  isAdmin?: boolean;
  rates?: RateDto[];
  last_visit?: string;
  created_date?: string;
}

export class ChangeAdminStatusDto {
  id: string;
  status: boolean;
}

export class ChangeUserDataDto {
  login?: string;
  phone?: string;
  name?: string;
  email?: string;
}
