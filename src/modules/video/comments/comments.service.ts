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
import { VideoService } from '../video/video.service';
import { Errors } from 'src/errors/auth';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<
      CommentDto & { updated_date: string }
    >,
    private readonly usersService: UsersService,
    private readonly videoService: VideoService,
  ) {}

  async getComments({
    page,
    perPage,
    videoId,
  }: CommentsPaginationQuery): Promise<PaginatedCommentDto> {
    const [data, total] = await this.commentsRepository.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage,
      order: { updated_date: 'DESC' },
      relations: ['author'],
      where: { video: { id: videoId } },
    });
    return { data, total, currentPage: page };
  }

  async saveComment(
    { text, videoId }: CommentBodyDto,
    authorId: string,
  ): Promise<void> {
    const video = await this.videoService.getVideoById(videoId, true, [
      'comments',
    ]);
    const author = await this.usersService.getUserById(authorId, ['comments']);
    await this.commentsRepository.save({ text, video, author });
  }

  deleteComment = async ({
    userId,
    commentId,
    videoId,
  }: DeleteCommentDto & { userId: string }) => {
    const comment = await this.commentsRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'video'],
    });
    const currentUser = await this.usersService.getUserById(userId);
    const isCurrentComment = comment.id === commentId;
    const isBelongToUser = comment.author.id === userId;
    const isBelongToVideo = comment.video.id === videoId;
    const isCurrentUserAdmin = !!currentUser.isAdmin;
    if (!isCurrentComment) {
      throw new BadRequestException(Errors.comments.incorrectCommentId);
    }
    if (!(isBelongToUser || isCurrentUserAdmin)) {
      throw new BadRequestException(Errors.comments.incorrectUser);
    }
    if (!isBelongToVideo) {
      throw new BadRequestException(Errors.comments.incorrectVideo);
    }
    if (
      isCurrentComment &&
      isBelongToVideo &&
      (isBelongToUser || isCurrentUserAdmin)
    ) {
      await this.commentsRepository.delete(comment.id);
    }
  };
}
