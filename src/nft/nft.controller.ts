import { Body, Controller, Get, HttpCode, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NFT } from 'src/shared/entity/nft-mint.entity';
import { NFTMintDto } from './dto/nft-mint-dto';
import { NFTTransactionDTO } from './dto/nft-transaction-dto';
import { UpdateOwnerDto } from './dto/update-owner-dto';
import { NftService } from './nft.service';

@Controller('nft')
export class NftController {
    constructor(private nftService: NftService){}

    // for storing nft in nft table
    @ApiTags("NFT")
    @Post("/nft-mint")
     async NFTMint(@Body(ValidationPipe) nftMintDto: NFTMintDto){
        return await this.nftService.NFTMint(nftMintDto);
    }

    // for searching nfts from nft table 
    @ApiTags("NFT")
    @Get("/nft-search/:search_char")
    async NFTSearch(@Param("search_char") search_char : string){
       return await this.nftService.NFTSearch(search_char);
    }

    // for changing NFT owner while user purchased any nft
    // @ApiTags("NFT")
    // @Patch("/:update_owner")
    // async NFTOwnerUpdate(@Body(ValidationPipe) updatedOwnerDto : UpdateOwnerDto){
    //     return await this.nftService.NFTOwnerUpdate(updatedOwnerDto);
    // }

    // Actual transaction
    @ApiTags("NFT")
    @Post("/transaction")
    async NFTTransaction(@Body(ValidationPipe) NFTTransactionDto : NFTTransactionDTO){
        return await this.nftService.NFTTransaction(NFTTransactionDto);
    }

    // NFT fetching as per category:
    @ApiTags("NFT")
    @Get("/nft")
    async NFTCategoryData(){
        return await this.nftService.NFTCategoryData();
    }

    // Return total no. of user,nft and transactions:
    @ApiTags("NFT")
    @Get("/total-count")
    async totalCount() : Promise<object> {
      return await this.nftService.totalCount();
    }

    @ApiTags("NFT")
    @Get("/transaction")
    async getAllTransactions(){
       return await this.nftService.getAllTransaction();
    }

    @ApiTags("NFT")
    @Get("/user")
    async getAllUsers(){
       return await this.nftService.getAllUsers();
    }
}
