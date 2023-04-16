import { Module, OnModuleInit } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule implements OnModuleInit {
  constructor(private fileService: FileService) {}

  onModuleInit() {
    this.fileService.initS3();
  }
}
