import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Errors } from 'src/errors/auth';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any) {
    const oneMb = 1000000;
    if (value.size < oneMb * 5) {
      return value;
    } else {
      throw new BadRequestException(Errors.fileSizeExceed);
    }
  }
}
