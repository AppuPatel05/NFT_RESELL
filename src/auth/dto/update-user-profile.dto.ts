import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserProfileDTO{
    @ApiProperty({
        description: `Enter MetamaskAddress`,
        example: `0x...`
    })
    metamask_address : string;
}