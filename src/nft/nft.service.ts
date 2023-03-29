import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository } from 'typeorm';
import { NFTMintDto } from './dto/nft-mint-dto';
import { NFT } from '../shared/entity/nft-mint.entity';
import { NFTRepository } from './nft-repository';
import { UserRepository } from 'src/auth/user-repository';
import { NFTCategory } from 'src/shared/enums/nft-category.enum';
import { User } from 'src/shared/entity/user.entity';
import { UpdateOwnerDto } from './dto/update-owner-dto';
import { NFTTransactionDTO } from './dto/nft-transaction-dto';

@Injectable()
export class NftService {
    constructor(
        @InjectRepository(NFTRepository)
        private nftRepository : NFTRepository,

        @InjectRepository(UserRepository)
        private userRepository : UserRepository,
    ){}
    async NFTMint(nftMintDto: NFTMintDto){
        const {nft_name,nft_description,nft_price,nft_image_link,user} = nftMintDto;
        const nft = new NFT();
        nft.nft_name = nft_name;
        nft.nft_description = nft_description;
        nft.nft_price = nft_price;
        nft.nft_image_link = nft_image_link;  
        nft.category = NFTCategory.art;
        const userIdFromMetamaskAddress = await this.userRepository.findOne({metamask_address:user});
            
        nft.user = userIdFromMetamaskAddress;
        nft.mint_by = userIdFromMetamaskAddress;
        nft.current_owner = userIdFromMetamaskAddress;

        const nftResponse = await this.nftRepository.NFTMint(nft);
        
        if(nftResponse.nft_name){
            return true; 
        }
        else{
            throw new InternalServerErrorException();
        }
    }

    async NFTSearch(search_char : string){
        return await this.nftRepository.NFTSearch(search_char);
    }

    async NFTOwnerUpdate(updatedOwnerDto : UpdateOwnerDto){
        const {current_owner,updated_owner} = updatedOwnerDto;
        const {sender,receiver} = await this.findUser(current_owner,updated_owner)
        
        
        // const current_user = await this.userRepository.findOne({metamask_address:current_owner});    

        const current_user_id = sender.userid;
        // const updatedUser = await this.userRepository.findOne({metamask_address:updated_owner});
        await this.nftRepository.NFTOwnerUpdate(current_user_id,receiver);
    }

    async NFTTransaction(NFTTransactionDto : NFTTransactionDTO){
        const {sender,receiver,nft} = NFTTransactionDto;
        const obj1 = await this.findUser(sender,receiver);
        const senderUser = obj1.sender;
        const receiverUser = obj1.receiver;
        const NFTDetails = await this.nftRepository.findOne({nft_image_link:nft})

        const senderUserId = senderUser.userid;
        const receiverUserId = receiverUser.userid;
        const NFTPrice = NFTDetails.nft_price;
        const NFTId = NFTDetails.nft_id;

        await this.nftRepository.NFTTransaction(senderUserId,receiverUserId,NFTPrice,NFTId);


        
    }




    async findUser(user1:string,user2:string){
        const sender = await this.userRepository.findOne({metamask_address:user1});    
        const receiver = await this.userRepository.findOne({metamask_address:user2});    
        return ({sender,receiver});

    }
}
