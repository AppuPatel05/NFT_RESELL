import { ApiProperty } from "@nestjs/swagger";

export class UpdateMetamaskAddressDto{
    @ApiProperty({
        description: `Enter Emailid or Username`,
        example: `Jondoe123@`
    })
    emailORUsername: string;

    @ApiProperty({
        description: `Enter MetamaskAddress`,
        example: `Jondoe123@`
    })
    metamask_address : string;
}