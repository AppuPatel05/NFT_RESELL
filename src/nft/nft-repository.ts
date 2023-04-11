import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UUIDVersion } from 'class-validator';
import { Transaction } from 'src/shared/entity/transaction-nft.entity';
import { User } from 'src/shared/entity/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { NFT } from '../shared/entity/nft-mint.entity';
import { UpdateOwnerDto } from './dto/update-owner-dto';

@EntityRepository(NFT)
export class NFTRepository extends Repository<NFT> {

  async NFTMint(nft: NFT) {
    try {
        const resNft = await nft.save();
        return resNft;
    } catch (error) {
      return error;
    }
  }

  async NFTSearch(search_char: string) {
    try {
      const searchNFTs = await this.createQueryBuilder('nft')
        .where('nft_name LIKE :nft_name', { nft_name: `%${search_char}%` })
        .orWhere('nft.nft_description LIKE :nft_desc', {
          nft_desc: `%${search_char}%`,
        })
        .execute();

      let arr = [];
      if (searchNFTs != '') {
        searchNFTs.map((data) => {
          arr.push({
            nft_name: data.nft_nft_name,
            nft_desc: data.nft_nft_description,
            nft_price: data.nft_nft_price,
            nft_image_link: data.nft_nft_image_link,
          });
        });
        // console.log(newArr);
       return arr;
      } else {
        return false;    
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async NFTOwnerUpdate(current_owner: string, updated_owner: User,nft:string) {
    
    // if updatedUser === 0 then there is no nft belonging to current_owner;

    try {
      const updatedUser = await this.createQueryBuilder('nft')
        .update()
        .set({ current_owner: updated_owner })
        .where('nft.current_owner= :current_owner_id', { current_owner_id: current_owner })
        .andWhere('nft.nft_image_link= :nft_link',{nft_link: nft})
        .execute();
  


        
      if (updatedUser.affected >= 1) {
        return updatedUser;
      } else {
        return false;
      }
    } catch (error) {
        throw new BadRequestException(error);
    }
  }

  async NFTTransaction(
    senderUserId: string,
    receiverUserId: string,
    NFTPrice: number,
    NFTId: string,
  ) {
   
    const transaction = new Transaction();
    transaction.sender = senderUserId,
    transaction.receiver = receiverUserId,
    transaction.amount = NFTPrice,
    transaction.nft_id = NFTId

    const transactionSave = await transaction.save();

    if (transactionSave) {
      return transaction;
    } else {
      return false;
    }
  }

  async findNFTs() {
    // const res = await this.createQueryBuilder('nft')
    // .select()
    // .execute();

const res = await this
    .createQueryBuilder("nft")
    .leftJoinAndSelect("nft.current_owner", "user")
    .getMany()

    // console.log(res);
    


    // const res = await this.find({
    //    relations : {

    //    }
    // });
    return res;
  }
}
