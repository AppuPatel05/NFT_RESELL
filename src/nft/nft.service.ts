import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
import { Transaction } from 'src/shared/entity/transaction-nft.entity';

@Injectable()
export class NftService {
  constructor(
    @InjectRepository(NFTRepository)
    private nftRepository: NFTRepository,

    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  // Storing NFTs in postgresql nft table:
  async NFTMint(nftMintDto: NFTMintDto) {
    const { nft_name, nft_description, nft_price, nft_image_link, user } =
      nftMintDto;
    const nft = new NFT();
    nft.nft_name = nft_name;
    nft.nft_description = nft_description;
    nft.nft_price = nft_price;
    nft.nft_image_link = nft_image_link;
    nft.category = NFTCategory.art;
    const userIdFromMetamaskAddress = await this.userRepository.findOne({
      metamask_address: user,
    });
    if(!userIdFromMetamaskAddress){
        throw new NotFoundException("Please provide valid metamask address!");
    }

    nft.user = userIdFromMetamaskAddress;
    nft.mint_by = userIdFromMetamaskAddress;
    nft.current_owner = userIdFromMetamaskAddress;

    const nftResponse : any = await this.nftRepository.NFTMint(nft);
    // console.log(nftResponse);
    
    if(nftResponse.nft_name){
        return {
            nft: {
              nft_name: nftResponse.nft_name,
              nft_description: nftResponse.nft_description,
              nft_price: nftResponse.nft_price,
              nft_image_link: nftResponse.nft_image_link,
              nft_category: nftResponse.category,
              user: nftResponse.user.userid,
              mintby: nftResponse.mint_by.userid,
              current_owner: nftResponse.current_owner.userid,
              nft_id: nftResponse.nft_id,
              nft_created_at: nftResponse.created_at,
            },
            status: 201,
            message: 'NFT stored succesfully',
          };
    }
    else{
      if(nftResponse.code == 23505){
        return {
            message: 'NFT alreday minted',
            status: nftResponse.code,
        };
      }
      else{
        return {
          message: 'Something went wrong while storing nft',
          status: nftResponse.code,
      };
      }
    }
  }

  // Searching NFT:
  async NFTSearch(search_char: string) {
    const nftSearchResponse = await this.nftRepository.NFTSearch(search_char);
    if(nftSearchResponse){
        return {
            nfts: nftSearchResponse,
            status: 200,
            message: 'NFTs fetched successfully',
        };
    }
    else{
        return {
            status: 404,
            message: 'No NFTs found!',
          };
    }
  }

  // NFT Owner updating:
  async NFTOwnerUpdate(updatedOwnerDto: UpdateOwnerDto) {
    
    // note: senderUser = updated_owner || receiverUser = current_owner
    const { senderUser, receiverUser,nft} = updatedOwnerDto;
    
    const current_user_id = receiverUser.userid;

    
    const NFTOwnerUpdate = await this.nftRepository.NFTOwnerUpdate(current_user_id, senderUser,nft);
    return NFTOwnerUpdate;
  }

  // NFT transaction:
  async NFTTransaction(NFTTransactionDto: NFTTransactionDTO) {
    const { sender, receiver, nft } = NFTTransactionDto;
    const obj1 = await this.findUser(sender, receiver);
    const senderUser = obj1.sender;
    const receiverUser = obj1.receiver;

    // console.log(senderUser,receiverUser);
     
    
    const NFTDetails = await this.nftRepository.findOne({
      nft_image_link: nft,
    });
    if(!NFTDetails){
      throw new NotFoundException("No NFT found!");
    }
    

    const senderUserId = senderUser.userid;
    const receiverUserId = receiverUser.userid;
    const NFTPrice = NFTDetails.nft_price;
    const NFTId = NFTDetails.nft_id;

    const NFTTransactionResponse =  await this.nftRepository.NFTTransaction(
      senderUserId,
      receiverUserId,
      NFTPrice,
      NFTId,
    );

    if(NFTTransactionResponse){
        const updateOwnerDto = {senderUser,receiverUser,nft}
        const updateOwnerResponse = await this.NFTOwnerUpdate(updateOwnerDto);

        
        if(updateOwnerResponse){
            return {
                trasaction : NFTTransactionResponse,
                status: 201,
                message: 'Transaction stored successfully',
            }
        }
        else{
           return {
            status : 404,
            message : "Please provide valid nft"
           }
        }

    }
    else{
        return {
            status : 500,
            message: "Something went wrong while storing transaction"
        }
    }


  }

  // Fetching all the nfts:
  async NFTCategoryData() {
    const nftResponse = await this.nftRepository.findNFTs();
    
    const nft = nftResponse.map((nftData)=>{
        return {
          nft_name : nftData.nft_name,
          nft_id:nftData.nft_id,
          nft_price: nftData.nft_price,
          nft_category: nftData.category,
          nft_username:nftData.current_owner.username,
          nft_image_link : nftData.nft_image_link
        }
    });

    if(nft){
      return {
        nft,
        status: 200,
        message: "NFT fetched successfully"
      };
    }
  }

  // Return total no. of user,nft and transactions:   
  async totalCount(): Promise<object> {
    const nftCount = await this.nftRepository.count();

    const userCount = await this.userRepository.count();

    const transactionCount = await Transaction.count();

    return {
      nftCount,
      userCount,
      transactionCount,
      status: {
        'status-code': 200,
      },
    };
  }   


  async getAllTransaction(){
    const allTransaction = await Transaction.find();
    if(allTransaction){
      return {
        transaction : allTransaction,
        status : 200,
        message : "All transactions fetched successfully"
      }
    }
  }


  async getAllUsers(){
    const allUser = await this.userRepository.find();
    // console.log(allUser);
    
    if(allUser){
      return {
        users : allUser,
        status : 200,
        message : "All users fetched successfully"
      }
    }
  }

  // Utility function : returns userid from metamask address: 
  async findUser(user1: string, user2: string) {
    try {
    // console.log(typeof user1,typeof user2);
    // console.log(user1, user2);
    
    const sender = await this.userRepository.findOne({
      metamask_address: user1,
    });
    // console.log(sender);
    
    const receiver = await this.userRepository.findOne({
      metamask_address: user2,
    });
    // console.log(sender,receiver);
    
    
    if(sender === undefined || receiver === undefined ){
        throw new NotFoundException("user not found");
    }
    return { sender, receiver };
} catch (error) {
    throw new BadRequestException(error);       
}
  }
}
