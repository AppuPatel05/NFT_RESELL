import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfig } from 'src/config/typeorm.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SendMailService } from '../shared/utility/send-email.utility';
import { UserRepository } from './user-repository';
import * as config from 'config';
import { PassportModule } from '@nestjs/passport/dist';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../shared/strategy/jwt-strategy';
// import { MulterModule } from '@nestjs/platform-express';
require('dotenv').config();




const mailConfig:any = config.get("mail");  


@Module({
  imports:[
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret:"SecretKey51",
      signOptions:{
        expiresIn: 3600,
      }
    }),
  // MulterModule.register({dest:'./uploads'}),
    // MailerModule.forRoot({
    //   transport:{
    //     host: process.env.host,
    //     port: process.env.port,
    //     auth: {
    //       user: process.env.user,
    //       pass: process.env.pass
    //     }
    //   }
    // }),
    MailerModule.forRoot({
      transport:{
        host: mailConfig.host,
        port: mailConfig.port,
        auth: {
          user: mailConfig.user,
          pass: mailConfig.pass
        }
      }
    }),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forRoot(TypeOrmConfig),

  ],
  controllers: [AuthController],
  providers: [AuthService,SendMailService,ConfigService,JwtStrategy],
  exports:[JwtStrategy,PassportModule]
})
export class AuthModule {}
