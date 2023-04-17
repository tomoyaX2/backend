import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from '../authors/authors.module';
import { BlockedAlbumModule } from '../blocked/blocked.module';
import { GroupModule } from '../group/group.module';
import { ImageModule } from '../image/image.module';
import { LanguagesModule } from '../languages/languages.module';
import { LogModule } from '../log/log.module';
import { SeriesModule } from '../series/series.module';
import { TagsModule } from '../tags/tags.module';
import { TypeModule } from '../type/type.module';
import { AlbumController } from './album.controller';
import { Album } from './album.entity';
import { AlbumService } from './album.service';
import { UsersModule } from '../users/users.module';
import { RateModule } from '../rate/rade.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),
    ImageModule,
    TagsModule,
    SeriesModule,
    LanguagesModule,
    GroupModule,
    AuthorsModule,
    TypeModule,
    LogModule,
    BlockedAlbumModule,
    UsersModule,
    RateModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
