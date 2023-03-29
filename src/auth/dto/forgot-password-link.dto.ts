import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ForgotPasswordLinkDto{
    @IsNotEmpty()
    @ApiProperty({
        description: `Enter Email`,
        example: `jondoe@gmail.com`
    })
    email: string;
}