import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/auth.guard';
import { PaginatedUsersDto, UserDto, ChangeAdminStatusDto } from './users.dto';
import { UsersService } from './users.service';

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
  @Post('change-admin-status')
  changeAdminStatus(@Body() body: ChangeAdminStatusDto): Promise<void> {
    return this.usersService.changeAdminStatus(body);
  }
}
