import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from "class-validator";

export class SignInCredentialDtos{

    @ApiProperty({
        description: `Enter Username`,
        example: `Jondoe`
    })
    @IsOptional()
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
        description: `Enter Email`,
        example: `jondoe@gmail.com`
    })
    @IsOptional()
    @IsEmail()
    email:  string;
}