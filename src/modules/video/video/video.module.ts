import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedVideoModule } from '../blocked/blocked.module';
import { LanguagesModule } from '../languages/languages.module';
import { LogModule } from '../../log/log.module';
import { TagsModule } from '../tags/tags.module';
import { TypeModule } from '../type/type.module';
import { VideoController } from './video.controller';
import { Video } from './video.entity';
import { VideoService } from './video.service';
import { UsersModule } from '../../users/users.module';
import { RateModule } from '../rate/rade.module';
import { EpisodeModule } from '../episode/episode.module';
import { StudioModule } from '../studio/studio.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    TagsModule,
    LanguagesModule,
    TypeModule,
    LogModule,
    BlockedVideoModule,
    UsersModule,
    RateModule,
    EpisodeModule,
    StudioModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
