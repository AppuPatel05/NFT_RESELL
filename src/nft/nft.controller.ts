import { Body, Controller, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { NFTMintDto } from './dto/nft-mint-dto';
import { NFTTransactionDTO } from './dto/nft-transaction-dto';
import { UpdateOwnerDto } from './dto/update-owner-dto';
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

    @Get("/:search_char")
    async NFTSearch(@Param("search_char") search_char : string){
       return await this.nftService.NFTSearch(search_char);
    }

    @Patch("/:update_owner")
    async NFTOwnerUpdate(@Body() updatedOwnerDto : UpdateOwnerDto){
        return await this.nftService.NFTOwnerUpdate(updatedOwnerDto);
    }

    @Post("/transaction")
    async NFTTransaction(@Body() NFTTransactionDto : NFTTransactionDTO){
        await this.nftService.NFTTransaction(NFTTransactionDto);
    }
}
