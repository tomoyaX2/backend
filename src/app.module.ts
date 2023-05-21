import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UsersModule } from './modules/users/users.module';
import { LogModule } from './modules/log/log.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { GalleryModule } from './modules/manga/gallery/gallery.module';
import { AlbumModule } from './modules/manga/album/album.module';
import { AuthorsModule } from './modules/manga/authors/authors.module';
import { BlockedAlbumModule } from './modules/manga/blocked/blocked.module';
import { CommentsModule } from './modules/manga/comments/comments.module';
import { GroupModule } from './modules/manga/group/group.module';
import { ImageModule } from './modules/manga/image/image.module';
import { LanguagesModule } from './modules/manga/languages/languages.module';
import { RateModule } from './modules/manga/rate/rade.module';
import { SeriesModule } from './modules/manga/series/series.module';
import { TagsModule } from './modules/manga/tags/tags.module';
import { TypeModule } from './modules/manga/type/type.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: `smtps://${process.env.EMAIL_USER}:${process.env.EMAIL_PASSWORD}@smtp.gmail.com`,
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: 'templates',
        adapter: new EjsAdapter(),
      },
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ImageModule,
    TagsModule,
    AlbumModule,
    AuthorsModule,
    LanguagesModule,
    SeriesModule,
    UsersModule,
    TypeModule,
    GroupModule,
    LogModule,
    AuthModule,
    CommentsModule,
    MailModule,
    BlockedAlbumModule,
    GalleryModule,
    RateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
