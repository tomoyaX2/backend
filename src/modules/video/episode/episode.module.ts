import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './eposide.entity';
import { EpisodesController } from './episode.controller';
import { EpisodeService } from './episodes.service';
import { QualityModule } from '../quality/quality.module';

@Module({
  imports: [TypeOrmModule.forFeature([Episode]), QualityModule],
  controllers: [EpisodesController],
  providers: [EpisodeService],
  exports: [EpisodeService],
})
export class EpisodeModule {}
