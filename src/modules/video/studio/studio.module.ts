import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogModule } from '../../log/log.module';
import { StudioController } from './studio.controller';
import { Studio } from './studio.entity';
import { StudioService } from './studio.service';

@Module({
  imports: [TypeOrmModule.forFeature([Studio]), LogModule],
  controllers: [StudioController],
  providers: [StudioService],
  exports: [StudioService],
})
export class StudioModule {}
