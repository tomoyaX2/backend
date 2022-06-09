import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogModule } from '../log/log.module';
import { AuthorController } from './authors.controller';
import { Author } from './authors.entity';
import { AuthorService } from './authors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Author]), LogModule],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorsModule {}
