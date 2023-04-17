import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rate } from './rate.entity';
import { RateController } from './rate.controller';
import { RateService } from './rate.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rate])],
  controllers: [RateController],
  providers: [RateService],
  exports: [RateService],
})
export class RateModule {}
