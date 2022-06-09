import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogModule } from '../log/log.module';
import { TagsController } from './tags.controller';
import { Tag } from './tags.entity';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), LogModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
