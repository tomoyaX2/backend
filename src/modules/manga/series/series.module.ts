import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogModule } from '../../log/log.module';
import { SeriesController } from './series.controller';
import { Series } from './series.entity';
import { SeriesService } from './series.service';

@Module({
  imports: [TypeOrmModule.forFeature([Series]), LogModule],
  controllers: [SeriesController],
  providers: [SeriesService],
  exports: [SeriesService],
})
export class SeriesModule {}
