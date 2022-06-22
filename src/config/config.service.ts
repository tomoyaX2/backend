import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Album } from 'src/modules/album/album.entity';
import { Author } from 'src/modules/authors/authors.entity';
import { Comment } from 'src/modules/comments/comments.entity';
import { Gallery } from 'src/modules/gallery/gallery.entity';
import { Group } from 'src/modules/group/group.entity';
import { Image } from 'src/modules/image/image.entity';
import { Language } from 'src/modules/languages/languages.entity';
import { Series } from 'src/modules/series/series.entity';
import { Tag } from 'src/modules/tags/tags.entity';
import { Type } from 'src/modules/type/type.entity';
import { User } from 'src/modules/users/users.entity';

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
      ],
      ssl: {
        ca: process.env.SSL_CERT,
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
