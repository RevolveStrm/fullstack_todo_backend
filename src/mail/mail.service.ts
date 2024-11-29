import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  // async sendMail(to: string, subject: string, text: string): Promise<void> {
  //   await this.mailerService.sendMail({
  //     from: 'no-reply@yourdomain.com',
  //     to,
  //     subject,
  //     text,
  //   });
  // }
}
