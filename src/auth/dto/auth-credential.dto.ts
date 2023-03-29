import { IsAlphanumeric, IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches, Max, Min } from "class-validator";
import { UserRole } from "../../shared/enums/user-role.enum";
import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class AuthCredentialDto{

    @ApiProperty({
        description: `Enter Username`,
        example: `Jondoe`
    })
    @IsNotEmpty()
    @Length(5,20)
    @IsString()
    username: string;

    @ApiProperty({
        description: `Enter password`,
        example: `Jondoe123@`
    })
    @IsNotEmpty()
    @Length(8,20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/ ,{message : "Password must contains { 8 character long || 1 Upper case || 1 Lower Case || 1 Special Symbol || 1 Numeric Value }" })
    password: string;

    @ApiProperty({
        description: `Confirm password`,
        example: `Jondoe123@`
    })
    @Column()
    confirm_password: string;

    @ApiProperty({
        description: `Enter Email`,
        example: `jondoe@gmail.com`
    })
    @IsNotEmpty()
    @IsEmail()
    email:  string;

    
    @IsOptional()
    role: UserRole;

    @IsOptional()
    @IsBoolean()
    is_verified: boolean;
    
    @IsOptional()
    @IsBoolean()
    is_deleted: boolean;
}