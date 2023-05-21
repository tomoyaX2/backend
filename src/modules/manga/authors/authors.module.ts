import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from './authors.controller';
import { Author } from './authors.entity';
import { AuthorService } from './authors.service';
import { LogModule } from 'src/modules/log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Author]), LogModule],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorsModule {}
