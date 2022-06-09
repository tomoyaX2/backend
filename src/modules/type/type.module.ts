import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogModule } from '../log/log.module';
import { TypeController } from './type.controller';
import { Type } from './type.entity';
import { TypeService } from './type.service';

@Module({
  imports: [TypeOrmModule.forFeature([Type]), LogModule],
  controllers: [TypeController],
  providers: [TypeService],
  exports: [TypeService],
})
export class TypeModule {}
