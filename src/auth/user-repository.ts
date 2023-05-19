import { ConflictException,InternalServerErrorException,UnauthorizedException,HttpException, HttpStatus } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialDto } from "./dto/auth-credential.dto";
import { UserRole } from "../shared/enums/user-role.enum";
import { Users } from "../shared/entity/user.entity";
import * as bcrypt from 'bcrypt';
import { SignInCredentialDtos } from "./dto/signincredentail.dto";

@EntityRepository(Users)
export class UserRepository extends Repository<Users>{

    async signUp(user:Users){
        try{
            const userSaved = await user.save();
            return userSaved;
        }catch(err){
            if(err.code === '23505'){
                throw new ConflictException("username or email already exists");
            }
            else{
                throw new InternalServerErrorException("something went wrong!");
            }
        }
    }

    async hashPassword(password:string, salt : string): Promise<string>{
        return bcrypt.hash(password,salt);
    }

    async validateUserPassword(signInCredentialDto: SignInCredentialDtos){
            
        const {username,email,password} =signInCredentialDto;

        const query = this.createQueryBuilder('user');
        if(!username && !email){
            throw new UnauthorizedException('Username/Email or Password is required..!');
        }
        if(username){
            query.andWhere("user.username = :username",{username});
        }else{
            query.andWhere("user.email = :email",{email});
        }

        try {
            const user = await query.getOne();
            
            if(!user){
                throw new UnauthorizedException('User does not exists');
            }    
            if(!user.is_verified){
                throw new UnauthorizedException('Please verify your email address');
            }
            
            const validateStatus = await user.validatePassword(password);
            if(validateStatus){
                return {
                    statusCode : 200,
                    username: user.username,
                    validateStatus
                };
            }
            else{
                return{
                    statusCode : 200,
                    validateStatus
                }
            }
        } catch (error) {
            throw new HttpException(error.message,error.status)
        }
    }
   
    async metamaskAddressUpdate(emailORUsername:string,metamask_address:string){
        try {
            const res = await this.createQueryBuilder().update().set({metamask_address}).where("email= :emailORUsername OR username= :emailORUsername",{emailORUsername}).execute()
        

            if(res.affected){ 
                return true;
            }else{
                return false;
            }

        } catch (error) {
        
            if(error.code ==23505){
                throw new ConflictException("Metamask account already in use");
            }
            else{
                throw new InternalServerErrorException("Metamask Address is not updated");
            }
        }
    }
}