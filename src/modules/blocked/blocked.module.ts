import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockedAlbumController } from './blocked.controller';
import { BlockedAlbum } from './blocked.entity';
import { BlockedAlbumService } from './blocked.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlockedAlbum])],
  controllers: [BlockedAlbumController],
  providers: [BlockedAlbumService],
  exports: [BlockedAlbumService],
})
export class BlockedAlbumModule {}
