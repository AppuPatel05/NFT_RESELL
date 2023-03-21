import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendMailService {
  constructor(
    private mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(emailAddress: string,userId: string,subject : string,html:string) {
    await this.mailService.sendMail({
      to: emailAddress,
      from: 'testxyz0110@gmail.com',
      subject,
      html,
    });
    return {
      status: 'success',
      message: 'Mail is sent to registered email address',
    };
  }
}
