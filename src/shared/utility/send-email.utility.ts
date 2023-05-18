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
          statusCode: 200,
          message: 'Mail is sent to registered email address',
        };
      } else {
        return {
          statusCode: 503,
          message: 'Mail is failed to send because of network issue',
        };
      }
      
      
    } catch (error) {

      return{
        statusCode : error.errno,
        message: error.message
      };


      // throw new InternalServerErrorException("Something went wrong at sending mail");
    }
  }
}
