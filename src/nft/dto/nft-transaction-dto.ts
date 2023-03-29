import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class NFTTransactionDTO{
    
    @ApiProperty({
        description: `Enter Current User Metamask Address`,
        example: `0x...`
    })
    @IsNotEmpty()
    sender:string;

    @ApiProperty({
        description: `Enter Current User Metamask Address`,
        example: `0x...`
    })
    @IsNotEmpty()
    receiver:string;

    @ApiProperty({
        description: `Enter NFT Link`,
        example: `www.pinata.ipfs.com/...`
    })
    @IsNotEmpty()
    nft:string;

    @IsNotEmpty()
    nft_id:string;

}