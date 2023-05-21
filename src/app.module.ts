import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configService } from './config/config.service';
import { UsersModule } from './modules/users/users.module';
import { LogModule } from './modules/log/log.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { AlbumModules } from './modules/manga';
import { VideoModules } from './modules/video';
import { AuthModule } from './modules/auth/auth.module';

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
    ...AlbumModules,
    ...VideoModules,
    UsersModule,
    AuthModule,
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
