import {
  ConflictException,
  GatewayTimeoutException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { PasswordResetDto } from './dto/password-reset-dto.dto';
import { SignInCredentialDtos } from './dto/signincredentail.dto';

import { SendMailService } from '../shared/utility/send-email.utility';
import { UserRepository } from './user-repository';
import { Users } from '../shared/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../shared/enums/user-role.enum';
import { UpdateMetamaskAddressDto } from './dto/update-address-dto';
import { JWTPayload } from 'src/shared/interfaces/jwt-payload.interface';
import { v4 as uuid } from 'uuid';
import { ForgotPasswordLinkDto } from './dto/forgot-password-link.dto';
import { buffer } from 'stream/consumers';
import { UpdateUserProfileDTO } from './dto/update-user-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: SendMailService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto){
    const { username, password,confirm_password ,email, is_verified, is_deleted } =
      authCredentialDto;
      // console.log(authCredentialDto);

      
      
    if(password !== confirm_password){
      throw new ConflictException("confirm password doesn't match")
    }
    const salt = await bcrypt.genSalt();
    const user = new Users();
    user.userid = uuid();
    
    user.username = username;
    user.password = await this.userRepository.hashPassword(password, salt);
    user.email = email;
    user.role = UserRole.User;
    user.is_verified = false;
    user.is_deleted = false;
    user.salt = salt;
 
    
    const userDataSave =  await this.userRepository.signUp(user);  
    // console.log(userDataSave);
    
    return {
      user: userDataSave,
      status_code : 201,
      message : "User registered successfully"
    }
  }

  async getUserFromMetamskAddress(metamaskAddress: string) : Promise<Object>{    
    const user = await this.userRepository.findOne({metamask_address:metamaskAddress});
    
    if (!user) {
      throw new NotFoundException('user not found!');
    }
    return {
      user: {
          username: user.username,
          email : user.email,
          profile_pic: user.profilePic
      },
      message: "User fetched successfully",
      status_code: 200
  }
  }

  async verifyUser(id: number) {
    const verifiedStatusResponse = await this.userRepository.createQueryBuilder("user")
    .update()
    .set({is_verified : true})
    .where("userid= :userid",{userid: id})
    .execute()
    
    if(verifiedStatusResponse.affected === 1){
      return {
        status_code : 201,
        message: "user verified successfully"
      }
    }
    else{
      return {
        status_code : 500,
        message: "user verification failed due to database error"  
      }
    }
  }

  async signIn(
    signincredentailDto: SignInCredentialDtos,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      signincredentailDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JWTPayload = { username };

    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  async forgotPasswordMail(forgotPasswordLinkDto: ForgotPasswordLinkDto) {
    const { email } = forgotPasswordLinkDto;
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }

    let encodedUserId = Buffer.from(user.userid).toString('base64');

    
    const verifyMessageTitle = 'OC NFT Marketplace - Forgot Password'
    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><!--[if gte mso 9]><xml><o:officedocumentsettings><o:allowpng><o:pixelsperinch>96</o:pixelsperinch></o:officedocumentsettings></xml><![endif]--><!--[if !mso]><!--><link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Baloo+Bhai+2:wght@600&display=swap" rel="stylesheet"><!--<![endif]--><title>OC NFT Marketplace</title><meta http-equiv="Content-type" content="text/html; charset=utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff" style="background-color:#fff" class="full-wrap"><tr><td align="center" valign="top"><table align="center" style="width:800px;max-width:800px;table-layout:fixed" class="oc_wrapper" width="800" border="0" cellspacing="0" cellpadding="0"><tr><td align="center" valine="top" style="padding:25px 25px;background:#f4f4f4;border-radius:40px" class="oc_pad_all oc_bor"><table width="740" border="0" cellspacing="0" cellpadding="0" align="center" style="width:740px" class="oc_wrapper"><tbody><tr><td align="center" valign="top" class="oc_pad_all" style="background:#fff;padding:40px;border-radius:8px"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td align="center" valign="top" style="padding-bottom:0"><table cellpadding="0" cellspacing="0" border="0"><tr><td align="center" valign="top"><h1 style="font-family:'Baloo Bhai 2',sans-serif;font-weight:700;user-select:none;color:rgba(162,89,255,1)">OC NFT Marketplace</h1></td></tr></table></td></tr><tr><td align="center" valign="top" style="padding-top:30px"><table align="left" cellpadding="0" cellspacing="0" border="0"><tr><td align="left" valign="top" style="font-family:Inter,sans-serif;font-weight:700;font-size:24px;line-height:29px;color:#0c1014;padding-bottom:20px">Hi ${user.username}</td></tr><tr><td align="left" valign="top" style="font-family:Inter,sans-serif;font-weight:400;font-size:16px;line-height:22px;color:#515759;padding-bottom:15px">You recently requested to reset the password for your account. Click the button below to proceed.</td></tr><tr><td align="left" valign="top" style="padding-bottom:15px"><table align="left" cellpadding="0" cellspacing="0" border="0"><tr><td align="left" valign="middle" height="45" style="display:block;border-radius:8px;font-family:Inter,sans-serif;font-weight:700;font-size:18px;color:#fff"><a href='http://192.168.1.25:3001/change-password/${encodedUserId}' class="oc_mobile_14 oc_mobile_padding_x" target="_blank" style="text-decoration:none;display:block;padding:0 45px;background-color:rgba(162,89,255,1);cursor:pointer;border-radius:8px;font-family:Inter,sans-serif;font-weight:700;font-size:18px;line-height:45px;color:#fff">Click Here</a></td></tr><tr><p id="id1"></p></tr></table></td></tr><tr><td align="left" valign="top" style="font-family:Inter,sans-serif;font-weight:400;font-size:16px;line-height:22px;color:#515759;padding-bottom:15px">If you did not request a password reset, please ignore this email or reply to let us know.<br><br>Thanks,<br>OneClick IT Consultancy Pvt. Ltd.</td></tr></table></td></tr></tbody></table></td></tr></tbody></table></td></tr></table></td></tr></table></html>`;
    // const html = `<a href='http://192.168.1.25:3000/change-password/${encodedUserId}'>click here</a>`
    const mailSend = await this.mailService.sendEmail(user.email,verifyMessageTitle,html);
    
    return mailSend;

    // const generatedOTP = this.generateOTP();

    // const subjectTitle = 'Forgot Password';
    // const html = `OTP : ${generatedOTP}`;

    // const otp = new OTP();
    // otp.userid = user.userid;
    // otp.email = user.email;
    // otp.otp = generatedOTP;
    // otp.isDeleted = false;
    // otp.expiredAt = new Date(Date.now() + 60000);

    // const otpIsSaved = await this.otpRepository.OTPSave(otp);
    // if (otpIsSaved) {
    //   const otpSend = await this.mailService.sendEmail(
    //     user.email,
    //     user.userid,
    //     subjectTitle,
    //     html,
    //   );
    //   return otpSend;
    // }
  }

  async forgotPassword(passwordResetDto: PasswordResetDto,id:string) {
   
    
    
    try {
      
    
    const { password, confirm_password } = passwordResetDto;
    let decodedUserId = Buffer.from(id, 'base64').toString();

    
    if(decodedUserId.charAt(0) == '?'){ 
      throw new NotFoundException("Please provide valid userid");
    }
    

    const user = await this.userRepository.findOne({ userid:decodedUserId });
    
    
    // console.log("not exec");
    
    if(!user || !user.is_verified){
        throw new UnauthorizedException('User does not exists');
    }

    if(password !== confirm_password){
        throw new ConflictException("confirm password does not matched");
    }

    const updatedPassword = await this.userRepository.hashPassword(
            password,
            user.salt,
    );

    try {
        const updatePasswordUser = await this.userRepository
              .createQueryBuilder('user')
              .update()
              .set({ password: updatedPassword })
              .where('userid= :userid', { userid:decodedUserId })
              .execute();
        if(updatePasswordUser.affected === 1){
            return {
                status_code: 201,
                message : "Your password is updated successfully"
            }
        }
    } catch (error) {
        throw new InternalServerErrorException('Something went wrong : Password is not updated');
    }
  }
 catch (error) {
  throw new InternalServerErrorException("Something went wrong while resetting password")
}
}
    // otp code start: -----------------------------------------------------

    // const userOTPDetails = await this.otpRepository
    //   .createQueryBuilder('otp')
    //   .where('otp.email= :email', { email })
    //   .andWhere('otp.isDeleted= :isDeleted', { isDeleted })
    //   .execute();

    // const matchedOTPDetails = userOTPDetails.filter((otpUser) => {
    //   return otpUser.otp_otp === otp;
    // });

    // if (matchedOTPDetails == '') {
    //   throw new ConflictException('OTP does not match OR It was expired');
    // } else {
    //   const updatedPassword = await this.userRepository.hashPassword(
    //     password,
    //     user.salt,
    //   );
    //   try {
    //     const updatePasswordUser = await this.userRepository
    //       .createQueryBuilder('user')
    //       .update()
    //       .set({ password: updatedPassword })
    //       .where('email= :email', { email })
    //       .execute();

    //     if (updatePasswordUser.affected === 1) {
    //       const resetOTPDeletedStatus = await this.otpRepository
    //         .createQueryBuilder('otp')
    //         .update()
    //         .set({ isDeleted: true })
    //         .where('email= :email', { email })
    //         .execute();

    //       return {
    //         status: 'success',
    //         message: 'password updated successfully :)',
    //       };
    //     }
    //   } catch (error) {
    //     throw new InternalServerErrorException('Something went wrong');
    //   }
    // }

    // if(userOTPDetails.isDeleted){
    //     throw new GatewayTimeoutException("OTP has expired");
    // }
    // if(userOTPDetails.otp === otp && userOTPDetails.isDeleted===false){
    //     user.password = await this.userRepository.hashPassword(password,user.salt);
    //     try {
    //         const updatePasswordUser = await user.save();
    //         return updatePasswordUser;
    //     } catch (error) {
    //         throw new InternalServerErrorException("Something went wrong");
    //     }
    // }
    // else{
    //     throw new ConflictException("OTP does not match");
    // }

    // otp code end: -----------------------------------------------------
  

  async metamaskAddressUpdate(
    updateMetamaskAddress: UpdateMetamaskAddressDto,
  ){
    const { emailORUsername, metamask_address } = updateMetamaskAddress;

    const updatedResult = await this.userRepository.metamaskAddressUpdate(
      emailORUsername,
      metamask_address,
    );
    if (updatedResult) {
      return {
        status_code : 201,
        success :  true,
        message: "metamask address updated successfully"
      }
    } else {
      return {
        status_code : 500,
        success :  false,
        message: "something went wrong while updaing metamask address"
      }
    }
  }

  async updateProfileImage(updatUserProfileDto: UpdateUserProfileDTO,profile_pic_name:string){
    const {metamask_address} = updatUserProfileDto;
    
    const user = await this.userRepository.findOne({metamask_address:metamask_address});
    if(!user){
      throw new NotFoundException("User not found");
    }
    const updateProfilePic = await this.userRepository
              .createQueryBuilder('user')
              .update()
              .set({ profilePic:  profile_pic_name})
              .where('metamask_address= :metamask_address', { metamask_address:metamask_address })
              .execute();
              
    if(updateProfilePic.affected === 1){
      return { 
        status_code: 201,
        message: "Profile pic updated successfully"
      }
    }
    else{
      return {
        status_code:500,
        message : "Profile pic does not updated"
      }
    }
    
  }




  generateOTP(length = 6): number {
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return parseInt(otp);
  }
}
