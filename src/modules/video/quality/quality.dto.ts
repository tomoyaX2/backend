import { EpisodeDto } from '../episode/episode.dto';

export interface QualityDto {
  id?: string;
  name: string;
  episodes?: EpisodeDto[];
  episode?: EpisodeDto;
}
