import { Controller, Get } from '@nestjs/common';
import { QualityService } from './quality.service';

@Controller('quality')
export class QualityController {
  constructor(private readonly qualityService: QualityService) {}

  @Get()
  getQualities() {
    return this.qualityService.getQualities();
  }
}
