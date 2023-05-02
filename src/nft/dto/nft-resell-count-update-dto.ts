import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class NFTUpdateResellDTO{

    @ApiProperty({
        description: `Enter JSON IPFS Link`,
        example: `https://oc-nft-marketplace.infura-ipfs.io/ipfs/QmRBPCZzS6KJienLw2hhbeibZFft4QxpgV8ybQFQZ9wxTp`
    })
    @IsNotEmpty()
    nft_json_link:string;

    @ApiProperty({
        description: `Enter Updated value of resell count`,
        example: 1
    })
    @IsNotEmpty()
    updatedValue: number;

}