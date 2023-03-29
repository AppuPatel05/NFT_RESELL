import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length, Matches } from "class-validator";

export class PasswordResetDto{

    @ApiProperty({
        description: `Enter New password`,
        example: `Jondoe123@`
    })
    @IsNotEmpty()
    @Length(8,20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/ ,{message : "Password must contains { 8 character long || 1 Upper case || 1 Lower Case || 1 Special Symbol || 1 Numeric Value }" })
    password: string;

    @ApiProperty({
        description: `Confirm Password`,
        example: `Jondoe123@`
    })
    confirm_password: string;
}