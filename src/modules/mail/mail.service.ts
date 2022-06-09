import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserDto } from '../users/users.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: UserDto, token: string) {
    const url = `${process.env.CLIENT_URL}?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      from: process.env.EMAIL_FROM,
      subject: 'Restore password',
      template: 'resetPass',
      context: {
        name: user.name,
        url,
      },
    });
  }
}
