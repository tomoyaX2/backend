import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { GroupDto, PaginatedGroupDto } from './group.dto';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiQuery({
    name: 'withAlbums',
    type: String,
    required: false,
  })
  @Get()
  getGroups(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('name') name: string,
    @Query('withAlbums') withAlbums: string,
  ): Promise<PaginatedGroupDto> {
    return this.groupService.getGroups({
      page: parseInt(page),
      perPage: parseInt(perPage),
      name,
      withAlbums: withAlbums == 'true',
    });
  }

  @Post()
  createGroup(@Body() group: GroupDto): Promise<GroupDto> {
    return this.groupService.createGroup(group);
  }
}
