import { ConflictException, GatewayTimeoutException, Injectable, InternalServerErrorException, NotFoundException,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'class-validator';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { OTPCredentialDto } from './dto/otp-credential.dto';
import { SignInCredentialDtos } from './dto/signincredentail.dto';

import { OTPRepository } from './otp-repository';
import { SendMailService } from '../shared/utility/send-email.utility';
import { UserRepository } from './user-repository';
import { User } from '../shared/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../shared/enums/user-role.enum';
import { OTP } from '../shared/entity/otp.entity';
import { UpdateMetamaskAddressDto } from './dto/update-address-dto';
import { JWTPayload } from 'src/shared/interfaces/jwt-payload.interface';
import v1 from 'uuid';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
        private jwtService : JwtService,
        private mailService: SendMailService,
        @InjectRepository(OTPRepository)
        private otpRepository: OTPRepository
    ){}

    async signUp(authCredentialDto: AuthCredentialDto) : Promise<User>{ 
        const {username,password,email,is_verified,is_deleted} = authCredentialDto;   
        const salt = await bcrypt.genSalt();
        const user = new User();    
        user.username = username;
        user.password = await this.userRepository.hashPassword(password,salt);
        user.email = email;
        user.role = UserRole.User;
        user.is_verified = is_verified;
        user.is_deleted = is_deleted;
        user.salt = salt;     
        return this.userRepository.signUp(user);
    }

    async getUserById(id: number) {
        const user = await this.userRepository.findOne(id);
        if(!user){
            throw new NotFoundException("Data not found!");
        }
        return user;
    }

    async verifyUser(id: number): Promise<User>{
        const user = await this.getUserById(id);
        user.is_verified = true;
        const verifiedUser = await user.save();
        return verifiedUser;
    }


    async signIn(signincredentailDto: SignInCredentialDtos):Promise<{accessToken:string}>{
        const username = await this.userRepository.validateUserPassword(signincredentailDto);
        
        if(!username){
            throw new UnauthorizedException("Invalid credentials");
        }
        const payload : JWTPayload = { username };

        const accessToken = await this.jwtService.sign(payload);
        return {accessToken};
    }

    async OTPSend(signincredentailDto: SignInCredentialDtos){
        const {email} = signincredentailDto;
        const user = await this.userRepository.findOne({email});
        if(!user){
            throw new UnauthorizedException("Email does not exists");
        }
        const generatedOTP = this.generateOTP();
        
        const subjectTitle = 'Forgot Password';
        const html = `OTP : ${generatedOTP}`;

        const otp = new OTP();
        otp.userid = user.userid;
        otp.email = user.email;
        otp.otp = generatedOTP;
        otp.isDeleted = false;
        otp.expiredAt = new Date(Date.now() + 60000);
        
        const otpIsSaved = await this.otpRepository.OTPSave(otp);
        if(otpIsSaved){
            const otpSend = await this.mailService.sendEmail(user.email,user.userid,subjectTitle,html);
            return otpSend;
        }
    }


    async OTPCheck(otpCredentialDto:OTPCredentialDto){
        const {email,password,otp} = otpCredentialDto;
        const isDeleted = false;
        const userOTPDetails = await this.otpRepository
        .createQueryBuilder("otp")
        .where("otp.email= :email",{email})
        .andWhere("otp.isDeleted= :isDeleted",{isDeleted})
        .execute();
        const user = await this.userRepository.findOne({email});
    
        const matchedOTPDetails = userOTPDetails.filter((otpUser)=> {
            return otpUser.otp_otp === otp;
        });

        if(matchedOTPDetails == ''){
            throw new ConflictException("OTP does not match OR It was expired");
        }
        else{
            const updatedPassword = await this.userRepository.hashPassword(password,user.salt);
            try {
                const updatePasswordUser = await this.userRepository.
                createQueryBuilder("user")
                .update()
                .set({password:updatedPassword})
                .where("email= :email",{email})
                .execute()

                if(updatePasswordUser.affected === 1){
                    
                    const resetOTPDeletedStatus = await this.otpRepository
                    .createQueryBuilder("otp")
                    .update()
                    .set({isDeleted:true})
                    .where("email= :email",{email})
                    .execute()
                    
                    return {status: "success",message: "password updated successfully :)"};
                }
            } catch (error) {
                throw new InternalServerErrorException("Something went wrong"); 
            }
        }
        
    
        

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
    }

    async metamaskAddressUpdate(updateMetamaskAddress : UpdateMetamaskAddressDto): Promise<boolean>{
        const {emailORUsername,metamask_address} = updateMetamaskAddress;
        
        const updatedResult = await this.userRepository.metamaskAddressUpdate(emailORUsername,metamask_address);
        if(updatedResult){
            return true;
        }else{
            return false;
        }
    }

    generateOTP(length = 6) : number{
    let otp = ''
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10)
    }
    return parseInt(otp);
}
}
