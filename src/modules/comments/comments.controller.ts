import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentBodyDto, PaginatedCommentDto } from './comments.dto';
import { AccessTokenGuard } from '../auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('comments')
@UseGuards(AccessTokenGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @ApiBearerAuth()
  getComments(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('name') name: string,
  ): Promise<PaginatedCommentDto> {
    return this.commentsService.getComments({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
    });
  }

  @Post()
  @ApiBearerAuth()
  createComment(@Body() comment: CommentBodyDto): Promise<void> {
    return this.commentsService.saveComment(comment);
  }
}
