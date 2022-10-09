import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { ImageModule } from './modules/image/image.module';
import { TagsModule } from './modules/tags/tags.module';
import { AlbumModule } from './modules/album/album.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { SeriesModule } from './modules/series/series.module';
import { UsersModule } from './modules/users/users.module';
import { TypeModule } from './modules/type/type.module';
import { GroupModule } from './modules/group/group.module';
import { LogModule } from './modules/log/log.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { MailModule } from './modules/mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { BlockedAlbumModule } from './modules/blocked/blocked.module';
import { GalleryModule } from './modules/gallery/gallery.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
