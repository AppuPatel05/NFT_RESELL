import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserProfileDTO{
    @ApiProperty({
        description: `Enter MetamaskAddress`,
        example: `Jondoe123@`
    })
    metamask_address : string;
}