import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserProfileDTO{
    @ApiProperty({
        description: `Enter MetamaskAddress`,
        example: `0x...`
    })
    metamask_address : string;

    @ApiProperty({
        description: `Enter Username or Email`,
        example: `John`
    })
    usernameOrEmail : string;

    // @ApiProperty({
    //     description: `Enter Email`,
    //     example: `johndoe@gmail.com`
    // })
    // email : string;



}