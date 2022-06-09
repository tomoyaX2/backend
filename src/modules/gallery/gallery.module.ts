import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GalleryController } from './gallery.controller';
import { Gallery } from './gallery.entity';
import { GalleryService } from './gallery.service';

@Module({
  imports: [TypeOrmModule.forFeature([Gallery])],
  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
