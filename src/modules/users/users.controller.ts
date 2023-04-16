import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UseGuards,
  Delete,
  ParseArrayPipe,
  UploadedFile,
  UseInterceptors,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/auth.guard';
import {
  PaginatedUsersDto,
  UserDto,
  ChangeAdminStatusDto,
  ChangeUserDataDto,
} from './users.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from '../file/validationPipe';
import { ChangeUserDataGuard } from './users.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  getUsers(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('name') name: number,
    @Query('email') email: number,
  ): Promise<PaginatedUsersDto> {
    return this.usersService.getUsers({ page, perPage, name, email });
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Get(':userId')
  getUserById(@Param('userId') userId: string): Promise<UserDto> {
    return this.usersService.getUserById(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch('change-admin-status')
  changeAdminStatus(@Body() body: ChangeAdminStatusDto): Promise<void> {
    return this.usersService.changeAdminStatus(body);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiQuery({
    name: 'userIds',
    type: [String],
    required: true,
  })
  deleteTags(
    @Query('userIds', ParseArrayPipe) userIds: string[],
  ): Promise<void> {
    return this.usersService.deleteUsers({ userIds });
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @Patch('upload-avatar')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'base64',
        },
      },
    },
  })
  uploadFile(
    @UploadedFile(FileSizeValidationPipe) file: Express.Multer.File,
    @Req() req,
  ) {
    this.usersService.saveUserAvatar({
      imageData: file.buffer,
      userId: req.sub,
    });
    return '';
  }

  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard, ChangeUserDataGuard)
  @Patch('update-profile')
  @HttpCode(200)
  updateUserData(@Body() userData: ChangeUserDataDto, @Req() req) {
    return this.usersService.updateUserProfileData({
      userData,
      userId: req.sub,
    });
  }
}
