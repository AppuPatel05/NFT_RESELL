import { Body, Controller, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, ValidationPipe } from '@nestjs/common';
import { Patch, Query, Redirect, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { SignInCredentialDtos } from './dto/signincredentail.dto';
import { UpdateMetamaskAddressDto } from './dto/update-address-dto';
import { SendMailService } from '../shared/utility/send-email.utility';

import { ForgotPasswordLinkDto } from './dto/forgot-password-link.dto';
import { PasswordResetDto } from './dto/password-reset-dto.dto';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { join } from 'path';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService,private mailService: SendMailService){}
    
    @ApiTags("User")
    @Post('/signup')    
    async signUp(@Body(ValidationPipe) authCredentialDto: AuthCredentialDto):Promise<Object>{
        // console.log(({imagePath:profile.filename}));
        // return {}
        const user =  await this.authService.signUp(authCredentialDto);
        if(user){
            const verifyMessageTitle = 'OC NFT Marketplace - Verification'
            const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml><o:officedocumentsettings><o:allowpng><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings></xml><![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Baloo+Bhai+2:wght@600&display=swap" rel="stylesheet"><!--<![endif]--><title>OC NFT Marketplace</title><meta http-equiv="Content-type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="background-color:#fff" class="full-wrap"><tr><td align="center" valign="top"><table align="center" style="width:800px;max-width:800px;table-layout:fixed" class="oc_wrapper" width="800" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valine="top" style="padding:25px 25px;background:#f4f4f4;border-radius:40px" class="oc_pad_all oc_bor"><table width="740" border="0" cellspacing="0" cellpadding="0" align="center" style="width:740px" class="oc_wrapper"><tbody><tr><td align="center" valign="top" class="oc_pad_all" style="background:#fff;padding:40px;border-radius:8px"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="center" valign="top" style="padding-bottom:0"><table cellpadding="0" cellspacing="0" border="0"><tr><td align="center" valign="top"><h1 style="font-family:'Baloo Bhai 2',sans-serif;font-weight:700;user-select:none;color:rgba(162,89,255,1)">OC NFT Marketplace</h1></td></tr></table></td></tr><tr><td align="center" valign="top" style="padding-top:30px"><table align="left" cellpadding="0" cellspacing="0" border="0"><tr><td align="left" valign="top" style="font-family:Inter,sans-serif;font-weight:700;font-size:24px;line-height:29px;color:#0c1014;padding-bottom:20px">Hello ${user.user.username}</td></tr><tr><td align="left" valign="top" style="font-family:Inter,sans-serif;font-weight:400;font-size:16px;line-height:22px;color:#515759;padding-bottom:15px">Your email address has been successfully registered. To confirm your email address, please click the link below.</td></tr><tr><td align="left" valign="top" style="padding-bottom:15px"><table align="left" cellpadding="0" cellspacing="0" border="0"><tr><td align="left" valign="middle" height="45" style="display:block;border-radius:8px;font-family:Inter,sans-serif;font-weight:700;font-size:18px;color:#fff"><a href="http://192.168.1.134:3000/auth/verify/${user.user.userid}" class="oc_mobile_14 oc_mobile_padding_x" target="_blank" style="text-decoration:none;display:block;padding:0 45px;background-color:rgba(162,89,255,1);cursor:pointer;border-radius:8px;font-family:Inter,sans-serif;font-weight:700;font-size:18px;line-height:45px;color:#fff"><b>Confirm My Email</b></a><br><br>Thanks,<br>OneClick IT Consultancy Pvt. Ltd.</td></tr></table></td></tr><tr><td align="left" valign="top" style="font-family:Inter,sans-serif;font-weight:400;font-size:16px;line-height:22px;color:#515759;padding-bottom:15px"><br>Thanks,<br>OneClick IT Consultancy Pvt. Ltd.</td></tr></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></table></td></tr></table></html>`;
            const mailSend = await this.mailService.sendEmail(user.user.email,verifyMessageTitle,html);
            return {user, mailSend};
        }
    }

    @Redirect("http://192.168.1.25:3000/login",301)
    @Get('/verify/:id')
    async verifyUser(@Param('id',ParseUUIDPipe) id : number){
        
        const userVerified = this.authService.verifyUser(id);
        if(userVerified){
            // return {status: "Success",Message: "You are now verified"}
            return userVerified;
        }
    }

    @ApiTags("User")
    @Post('/signin')
    async signIn(@Body(ValidationPipe) signInCredentialDto: SignInCredentialDtos){
        return this.authService.signIn(signInCredentialDto);
    }

    @ApiTags("User")
    @Post('/forgot-password-link')
    async forgotPasswordMail(@Body(ValidationPipe) forgotPasswordLinkDto: ForgotPasswordLinkDto){ 
        return this.authService.forgotPasswordMail(forgotPasswordLinkDto);
    }


    @ApiTags("User")
    @Post('/forgot-password/:id')
    async forgotPassword(@Body(ValidationPipe) passwordResetDto : PasswordResetDto,@Param('id')id :string){
        return this.authService.forgotPassword(passwordResetDto,id);
    }

    @ApiTags("User")
    @Patch('/update-metamask-address')
    async updateMetamaskAddress(@Body() updateMetamaskAddress:UpdateMetamaskAddressDto){
        return this.authService.metamaskAddressUpdate(updateMetamaskAddress);
    }

    @ApiTags("User")
    @Get("/user/get-user/:id")
    async getUserFromMetamaskAddress(@Param('id') metamaskAddress : string): Promise<Object>{
        return await this.authService.getUserFromMetamskAddress(metamaskAddress);
    }

    @ApiTags("User")
    @Get("/user/get_image")
    async getImageFunction(@Query() query:{image_link:string},@Res() res){
        return (res.sendFile(join(process.cwd(),"uploads/profile_images/"+query.image_link)));
    }

    @ApiTags("User")
    @Patch('/user/profile_image_setup') 
    @UseInterceptors(FileInterceptor('profile',{
        storage: diskStorage({
            destination: './uploads/profile_images/',
            filename: (req,file,cb) => {
                const filename:string = path.parse(file.originalname).name.replace(/\s/g,'') + uuidv4();
                const ext : string = path.parse(file.originalname).ext;
                cb(null,`${filename}${ext}`)
            }
        })
    }))
    async profile_image_set(@UploadedFile() profile ,@Body() updatUserProfileDto : UpdateUserProfileDTO){
        
        return await this.authService.updateProfileImage(updatUserProfileDto,profile.filename)
    }  

}
