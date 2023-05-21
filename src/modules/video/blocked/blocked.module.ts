import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedVideoController } from './blocked.controller';
import { BlockedVideo } from './blocked.entity';
import { BlockedVideoService } from './blocked.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedVideo])],
  controllers: [BlockedVideoController],
  providers: [BlockedVideoService],
  exports: [BlockedVideoService],
})
export class BlockedVideoModule {}
