import {
  ConflictException,
  GatewayTimeoutException,
  Injectable,
  InternalServerErrorException,
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
import { User } from '../shared/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../shared/enums/user-role.enum';
import { UpdateMetamaskAddressDto } from './dto/update-address-dto';
import { JWTPayload } from 'src/shared/interfaces/jwt-payload.interface';
import v1 from 'uuid';
import { ForgotPasswordLinkDto } from './dto/forgot-password-link.dto';
import { buffer } from 'stream/consumers';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private mailService: SendMailService,
  ) {}

  async signUp(authCredentialDto: AuthCredentialDto): Promise<User> {
    const { username, password,confirm_password ,email, is_verified, is_deleted } =
      authCredentialDto;
    if(password !== confirm_password){
      throw new ConflictException("confirm password doesn't match")
    }
    const salt = await bcrypt.genSalt();
    const user = new User();
    user.username = username;
    user.password = await this.userRepository.hashPassword(password, salt);
    user.email = email;
    user.role = UserRole.User;
    user.is_verified = is_verified;
    user.is_deleted = is_deleted;
    user.salt = salt;
    return this.userRepository.signUp(user);  
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Data not found!');
    }
    return user;
  }

  async verifyUser(id: number): Promise<User> {
    const user = await this.getUserById(id);
    user.is_verified = true;
    const verifiedUser = await user.save();
    return verifiedUser;
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
    const html = `<a href='http://192.168.1.25:3000/change-password/${encodedUserId}'>click here</a>`
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
    const { password, confirm_password } = passwordResetDto;
    let decodedUserId = Buffer.from(id, 'base64').toString();
    const user = await this.userRepository.findOne({ userid:decodedUserId });
    
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
                status: "Success",
                message : "Your Password is updated successfully :)"
            }
        }
    } catch (error) {
        throw new InternalServerErrorException('Something went wrong : Password is not updated');
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
  }

  async metamaskAddressUpdate(
    updateMetamaskAddress: UpdateMetamaskAddressDto,
  ): Promise<boolean> {
    const { emailORUsername, metamask_address } = updateMetamaskAddress;

    const updatedResult = await this.userRepository.metamaskAddressUpdate(
      emailORUsername,
      metamask_address,
    );
    if (updatedResult) {
      return true;
    } else {
      return false;
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
