import { QualityDto } from '../quality/quality.dto';
import { VideoDto } from '../video/video.dto';

export class EpisodeDto {
  id: string;
  url: string;
  name?: string;
  qualities?: QualityDto[];
  coverUrl?: string;
  availableQuality?: string[];
  video?: VideoDto;
}
