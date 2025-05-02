import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentsPaginationQuery } from 'src/shared/types';
import { Repository } from 'typeorm';
import {
  CommentBodyDto,
  CommentDto,
  DeleteCommentDto,
  PaginatedCommentDto,
} from './comments.dto';
import { Comment } from './comments.entity';
import { UsersService } from '../../users/users.service';
import { AlbumService } from '../album/album.service';
import { Errors } from 'src/errors/auth';
import { omit } from 'src/shared/utils';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<
      CommentDto & { updated_date: string }
    >,
    private readonly usersService: UsersService,
    private readonly albumService: AlbumService,
  ) {}

  async getComments({
    page,
    perPage,
    albumId,
  }: CommentsPaginationQuery): Promise<PaginatedCommentDto> {
    const [data, total] = await this.commentsRepository.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage,
      order: { updated_date: 'DESC' },
      relations: ['author'],
      where: { album: { id: albumId } },
    });

    const mappedData = data.map((el) => ({
      ...el,
      author: omit(el.author, ['password']),
    }));
    return { data: mappedData, total, currentPage: page };
  }

  async saveComment(
    { text, albumId }: CommentBodyDto,
    authorId: string,
  ): Promise<void> {
    const album = await this.albumService.getAlbumById(albumId, true, [
      'comments',
    ]);
    const author = await this.usersService.getUserById(authorId, ['comments']);
    await this.commentsRepository.save({ text, album, author });
  }

  deleteComment = async ({
    userId,
    commentId,
    albumId,
  }: DeleteCommentDto & { userId: string }) => {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'album'],
    });
    const currentUser = await this.usersService.getUserById(userId);
    const isCurrentComment = comment.id === commentId;
    const isBelongToUser = comment.author.id === userId;
    const isBelongToAlbum = comment.album.id === albumId;
    const isCurrentUserAdmin = !!currentUser.isAdmin;
    if (!isCurrentComment) {
      throw new BadRequestException(Errors.comments.incorrectCommentId);
    }
    if (!(isBelongToUser || isCurrentUserAdmin)) {
      throw new BadRequestException(Errors.comments.incorrectUser);
    }
    if (!isBelongToAlbum) {
      throw new BadRequestException(Errors.comments.incorrectAlbum);
    }
    if (
      isCurrentComment &&
      isBelongToAlbum &&
      (isBelongToUser || isCurrentUserAdmin)
    ) {
      await this.commentsRepository.delete(comment.id);
    }
  };
}
