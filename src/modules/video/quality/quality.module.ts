import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QualityController } from './quality.controller';
import { Quality } from './quality.entity';
import { QualityService } from './quality.service';

@Module({
  imports: [TypeOrmModule.forFeature([Quality])],
  controllers: [QualityController],
  providers: [QualityService],
  exports: [QualityService],
})
export class QualityModule {}
