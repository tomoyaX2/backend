import { Album } from './album/album.entity';
import { AlbumModule } from './album/album.module';
import { Author } from './authors/authors.entity';
import { AuthorsModule } from './authors/authors.module';
import { BlockedAlbum } from './blocked/blocked.entity';
import { BlockedAlbumModule } from './blocked/blocked.module';
import { Comment } from './comments/comments.entity';
import { CommentsModule } from './comments/comments.module';
import { Gallery } from './gallery/gallery.entity';
import { GalleryModule } from './gallery/gallery.module';
import { Group } from './group/group.entity';
import { GroupModule } from './group/group.module';
import { Image } from './image/image.entity';
import { ImageModule } from './image/image.module';
import { Language } from './languages/languages.entity';
import { LanguagesModule } from './languages/languages.module';
import { RateModule } from './rate/rade.module';
import { Rate } from './rate/rate.entity';
import { Series } from './series/series.entity';
import { SeriesModule } from './series/series.module';
import { Tag } from './tags/tags.entity';
import { TagsModule } from './tags/tags.module';
import { Type } from './type/type.entity';
import { TypeModule } from './type/type.module';

export const AlbumEntities = [
  Gallery,
  Series,
  Author,
  Image,
  Album,
  Language,
  Tag,
  Type,
  Group,
  Comment,
  BlockedAlbum,
  Rate,
];

export const AlbumModules = [
  ImageModule,
  TagsModule,
  AlbumModule,
  AuthorsModule,
  LanguagesModule,
  SeriesModule,
  TypeModule,
  GroupModule,
  CommentsModule,
  BlockedAlbumModule,
  GalleryModule,
  RateModule,
];
