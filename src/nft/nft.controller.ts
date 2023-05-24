import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NFT } from 'src/shared/entity/nft-mint.entity';
import { NFTCategoryValidationPipe } from 'src/shared/pipes/nft-category.pipe';
import { NFTMintDto } from './dto/nft-mint-dto';
import { NFTUpdateResellDTO } from './dto/nft-resell-count-update-dto';
import { NFTTransactionDTO } from './dto/nft-transaction-dto';
import { NFTBalanceDTO } from './dto/NFTBalanceDTO-dto';
import { UpdateOwnerDto } from './dto/update-owner-dto';
import { NftService } from './nft.service';

@Controller('nft')
@ApiResponse({
   status: 200,
   description: 'Success',
})
@ApiResponse({
   status: 404,
   description: 'Not Found',
})
@ApiResponse({
   status: 201,
   description: 'Created',
})
@ApiResponse({
   status: '5XX',
   description: 'Unexpected Error',
})
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

    @ApiTags("NFT")
    @Get("/resell_count/")
    async getResellCount(@Query('nft_json_link') nft_json_link : string){
       return await this.nftService.getResellCount(nft_json_link);
    }

    @ApiTags("NFT")
    @Patch("/update_resell_count/")
    async updateResellCount(@Body() nftResellDTO :NFTUpdateResellDTO ){
       return await this.nftService.updateResellCount(nftResellDTO);
    }

    @ApiTags("NFT")
    @Patch("/update_balance/")
    async updateBalance(@Body() nftBalanceDto : NFTBalanceDTO ){
       return await this.nftService.updateBalance(nftBalanceDto);
    }
}
