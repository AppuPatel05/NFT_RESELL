import { ApiProperty } from "@nestjs/swagger";

export class OTPCredentialDto{
    @ApiProperty({
        description: `Enter Email`,
        example: `jondoe@gmail.com`
    })
    email: string;

    @ApiProperty({
        description: `Enter OTP`,
        example: `123456`
    })
    otp: number;

    @ApiProperty({
        description: `Enter password`,
        example: `Jondoe123@`
    })
    password: string;
}