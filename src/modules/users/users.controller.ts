import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PaginatedUsersDto, UserDto } from './users.dto';
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
  getUsers(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('name') name: number,
    @Query('email') email: number,
  ): Promise<PaginatedUsersDto> {
    return this.usersService.getUsers({ page, perPage, name, email });
  }

  @ApiBearerAuth()
  @Get(':userId')
  getUserById(@Param('userId') userId: string): Promise<UserDto> {
    return this.usersService.getUserById(userId);
  }
}
