import {
  Body,
  Controller,
  Delete,
  Get,
  ParseArrayPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { GroupDto, PaginatedGroupDto } from './group.dto';
import { GroupService } from './group.service';
import { AccessTokenGuard } from '../../auth/auth.guard';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @ApiQuery({
    name: 'withAlbums',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'name',
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

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  @ApiQuery({
    name: 'groupIds',
    type: [String],
    required: true,
  })
  deleteSeries(
    @Query('groupIds', ParseArrayPipe) groupIds: string[],
  ): Promise<void> {
    return this.groupService.deleteGroup({ groupIds });
  }
}
