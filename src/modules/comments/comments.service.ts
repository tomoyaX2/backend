import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultPaginationQuery } from 'src/shared/types';
import { Repository } from 'typeorm';
import {
  CommentBodyDto,
  CommentDto,
  PaginatedCommentDto,
} from './comments.dto';
import { Comment } from './comments.entity';
import { UsersService } from '../users/users.service';
import { AlbumService } from '../album/album.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<CommentDto>,
    private readonly usersService: UsersService,
    private readonly albumService: AlbumService,
  ) {}

  async getComments({
    page,
    perPage,
  }: DefaultPaginationQuery): Promise<PaginatedCommentDto> {
    const [data, total] = await this.commentsRepository.findAndCount({
      take: perPage,
      skip: page * perPage,
    });
    return { data, total, currentPage: page };
  }

  async saveComment({
    text,
    albumId,
    authorId,
  }: CommentBodyDto): Promise<void> {
    const album = await this.albumService.getAlbumById(albumId);
    const user = await this.usersService.getUserById(authorId);

    const comment = await this.commentsRepository.save({ text, album, user });
    await this.albumService.updateAlbum({
      ...album,
      comments: [...(album.comments || []), comment],
    });
    await this.usersService.saveUser({
      ...user,
      comments: [...(user.comments || []), comment],
    });
  }
}
