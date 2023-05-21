import { Controller } from '@nestjs/common';
import { RateService } from './rate.service';

@Controller('video-rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}
}
