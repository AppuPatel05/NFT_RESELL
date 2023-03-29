import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateOwnerDto{
    @ApiProperty({
        description: `Enter Current User Metamask Address`,
        example: `0x...`
    })
    @IsNotEmpty()
    current_owner:string;

    @ApiProperty({
        description: `Enter Updated User Metamask Address`,
        example: `0x...`
    })
    @IsNotEmpty()
    updated_owner:string;
}