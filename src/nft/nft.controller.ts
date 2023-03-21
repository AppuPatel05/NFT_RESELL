import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { NFTMintDto } from './dto/nft-mint-dto';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
    constructor(private nftService: NftService){}


    @Post("/nft-mint")
    async NFTMint(@Body(ValidationPipe) nftMintDto: NFTMintDto){
        if(this.nftService.NFTMint(nftMintDto)){
            return {
                status : "success",
                messge: "NFT stored succesfully"
            } 
        }
    }
}
