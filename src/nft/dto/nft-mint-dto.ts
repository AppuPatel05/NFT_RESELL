import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { NFTCategory } from "src/shared/enums/nft-category.enum";

export class NFTMintDto{

    @ApiProperty({
        description: `Enter NFT`,
        example: `Jondoe123@`
    })
    @IsNotEmpty()
    nft_name: string;
    
    @ApiProperty({
        description: `Enter NFT Description`,
        example: `Jondoe123@`
    })
    @IsNotEmpty()
    nft_description : string;
    
    @ApiProperty({
        description: `Enter NFT Price`,
        example: `0.02`
    })
    @IsNotEmpty()
    @IsNumber()
    nft_price : number;
    
    @ApiProperty({
        description: `Enter NFT ImageLink`,
        example: `johndoe.ipfs`
    })
    @IsNotEmpty()
    nft_image_link : string;


    @ApiProperty({
        description: `Enter Metamask Address`,
        example: `0x...`
    })
    @IsNotEmpty()
    user:string;

    @ApiProperty({
        description: `Enter Category`,
        example: `art`
    })
    @IsNotEmpty()
    category:NFTCategory;

    @ApiProperty({
        description: `Enter NFT JSONLink`,
        example: `https://pinata.com/`
    })
    @IsNotEmpty()
    nft_json_link : string;

    @ApiProperty({
        description: `Enter resell count`,
        example: `0`
    })
    @IsNotEmpty()
    nft_resell_count : number;

}