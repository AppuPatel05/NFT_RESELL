import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendMailService {
  constructor(
    private mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(emailAddress: string, subject: string, html: string) {
    try {
      const returnMailResponse = await this.mailService.sendMail({
        to: emailAddress,
        from: 'testxyz0110@gmail.com',
        subject,
        html,
      });
      if (returnMailResponse.accepted != '') {
        return {
          status_code: 200,
          message: 'Mail is sent to registered email address',
        };
      } else {
        return {
          status_code: 503,
          message: 'Mail is failed to send because of network issue',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException("Something went wrong at sending mail");
    }
  }
}
