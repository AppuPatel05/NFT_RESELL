import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from 'typeorm';
import { NFTMintDto } from './dto/nft-mint-dto';
import { NFT } from '../shared/entity/nft-mint.entity';
import { NFTRepository } from './nft-repository';
import { UserRepository } from 'src/auth/user-repository';

@Injectable()
export class NftService {
    constructor(
        @InjectRepository(NFTRepository)
        private nftRepository : NFTRepository,

        @InjectRepository(UserRepository)
        private userRepository : UserRepository
    ){}
    async NFTMint(nftMintDto: NFTMintDto){
        const {nft_name,nft_description,nft_price,nft_image_link,user} = nftMintDto;
        const nft = new NFT();
        nft.nft_name = nft_name;
        nft.nft_description = nft_description;
        nft.nft_price = nft_price;
        nft.nft_image_link = nft_image_link;  
        const userFromMetamaskAddress = await this.userRepository.findOne({metamask_address:user});
            
        nft.user = userFromMetamaskAddress;

        const nftResponse = await this.nftRepository.NFTMint(nft);
        
        if(nftResponse.nft_name){
            return true;
        }
        else{
            throw new InternalServerErrorException();
        }
    }
}
