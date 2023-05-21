import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Gallery } from 'src/modules/manga/gallery/gallery.entity';
import { User } from 'src/modules/users/users.entity';
import * as fs from 'fs';
import { Album } from 'src/modules/manga/album/album.entity';
import { Author } from 'src/modules/manga/authors/authors.entity';
import { BlockedAlbum } from 'src/modules/manga/blocked/blocked.entity';
import { Group } from 'src/modules/manga/group/group.entity';
import { Language } from 'src/modules/manga/languages/languages.entity';
import { Rate } from 'src/modules/manga/rate/rate.entity';
import { Series } from 'src/modules/manga/series/series.entity';
import { Tag } from 'src/modules/manga/tags/tags.entity';
import { Type } from 'src/modules/manga/type/type.entity';
import { Image } from 'src/modules/manga/image/image.entity';
import { Comment } from 'src/modules/manga/comments/comments.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      // logging: true,
      entities: [
        User,
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
      ],
      ssl: {
        ca: process.env.SSL_CERT || fs.readFileSync('ca-certificate.crt'),
      },
      synchronize: true,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { configService };
