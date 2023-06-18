import { BlockedVideo } from './blocked/blocked.entity';
import { BlockedVideoModule } from './blocked/blocked.module';
import { Comment } from './comments/comments.entity';
import { CommentsModule } from './comments/comments.module';
import { EpisodeModule } from './episode/episode.module';
import { Episode } from './episode/eposide.entity';
import { Language } from './languages/languages.entity';
import { LanguagesModule } from './languages/languages.module';
import { Quality } from './quality/quality.entity';
import { QualityModule } from './quality/quality.module';
import { RateModule } from './rate/rade.module';
import { Rate } from './rate/rate.entity';
import { Studio } from './studio/studio.entity';
import { StudioModule } from './studio/studio.module';
import { Tag } from './tags/tags.entity';
import { TagsModule } from './tags/tags.module';
import { Type } from './type/type.entity';
import { TypeModule } from './type/type.module';
import { Video } from './video/video.entity';
import { VideoModule } from './video/video.module';

export const VideoEntities = [
  Video,
  Language,
  Episode,
  Tag,
  Type,
  Comment,
  BlockedVideo,
  Rate,
  Quality,
  Studio,
];

export const VideoModules = [
  VideoModule,
  LanguagesModule,
  TagsModule,
  TypeModule,
  CommentsModule,
  BlockedVideoModule,
  RateModule,
  EpisodeModule,
  QualityModule,
  StudioModule,
];
