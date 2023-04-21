import { ApiProperty } from "@nestjs/swagger";

export class UpdateMetamaskAddressDto{
    @ApiProperty({
        description: `Enter Emailid or Username`,
        example: `Jondoe123@ || jondoe@gmail.com`
    })
    emailORUsername: string;

    @ApiProperty({
        description: `Enter MetamaskAddress`,
        example: `0x...`
    })
    metamask_address : string;
}