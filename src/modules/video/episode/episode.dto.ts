import { QualityDto } from '../quality/quality.dto';
import { VideoDto } from '../video/video.dto';

export class EpisodeDto {
  id: string;
  url: string;
  name?: string;
  qualities?: QualityDto[];
  availableQuality?: string[];
  video?: VideoDto;
}
