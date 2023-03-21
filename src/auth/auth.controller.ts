import { Body, Controller, Get, Param, ParseIntPipe, Post, ValidationPipe } from '@nestjs/common';
import { Patch, Req } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { OTPCredentialDto } from './dto/otp-credential.dto';
import { SignInCredentialDtos } from './dto/signincredentail.dto';
import { UpdateMetamaskAddressDto } from './dto/update-address-dto';
import { SendMailService } from '../shared/utility/send-email.utility';
import { User } from '../shared/entity/user.entity';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService,private mailService: SendMailService){}
    

    @Post('/signup')
    async signUp(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto){
        const user = await this.authService.signUp(authCredentialDto);

        if(user){
            const verifyMessageTitle = 'OC NFT Marketplace - Verification'
            const html = `<a href='http://192.168.1.134:3000/auth/verify/${user.userid}'>click here</a>`
            const mailSend = await this.mailService.sendEmail(user.email,user.userid,verifyMessageTitle,html);
            return mailSend;
        }
    }

    @Get('/verify/:id')
    async verifyUser(@Param('id') id : number){
        const userVerified = this.authService.verifyUser(id);
        if(userVerified){
            return {status: "Success",Message: "You are now verified"}
        }
    }

    @Post('/signin')
    async signIn(@Body() signInCredentialDto: SignInCredentialDtos){
        return this.authService.signIn(signInCredentialDto);
    }

    @Post('/reset-otpsend')
    async OTPSend(@Body() signInCredentialDto: SignInCredentialDtos){ 
        return this.authService.OTPSend(signInCredentialDto);
    }

    @Post('/reset-password')
    async OTPCheck(@Body() otpCredentialDto : OTPCredentialDto){
        return this.authService.OTPCheck(otpCredentialDto);
    } 

    @Patch('/update-metamask-address')
    async updateMetamaskAddress(@Body() updateMetamaskAddress:UpdateMetamaskAddressDto):Promise<boolean>{
        return this.authService.metamaskAddressUpdate(updateMetamaskAddress);
    }
}
