import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentBodyDto, PaginatedCommentDto } from './comments.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/modules/auth/auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getComments(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('albumId') albumId: string,
  ): Promise<PaginatedCommentDto> {
    return this.commentsService.getComments({
      page: parseInt(page),
      perPage: parseInt(perPage),
      albumId,
    });
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  createComment(@Body() comment: CommentBodyDto, @Req() req): Promise<void> {
    return this.commentsService.saveComment(comment, req.sub);
  }

  @Delete(':commentId/:albumId')
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  deleteComment(
    @Param('albumId') albumId: string,
    @Param('commentId') commentId: string,
    @Req() req,
  ): Promise<void> {
    return this.commentsService.deleteComment({
      albumId,
      commentId,
      userId: req.sub,
    });
  }
}
