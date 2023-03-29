import { InternalServerErrorException } from "@nestjs/common";
import { Transaction } from "src/shared/entity/transaction-nft.entity";
import { User } from "src/shared/entity/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { NFT } from "../shared/entity/nft-mint.entity";
import { UpdateOwnerDto } from "./dto/update-owner-dto";

@EntityRepository(NFT)
export class NFTRepository extends Repository<NFT>{

    async NFTMint(nft:NFT){
        try {
            const resNft = await nft.save();
            return resNft;
        } catch (error) {
           return error;
        }
    }

    async NFTSearch(search_char:string){
        
        const searchNFTs = await this.createQueryBuilder("nft")
        .where("nft_name LIKE :nft_name",{nft_name: `%${search_char}%`})
        .orWhere("nft.nft_description LIKE :nft_desc",{nft_desc: `%${search_char}%`})
        .execute();


        let arr = [];
        if(searchNFTs != ''){
            const newArr = searchNFTs.map((data) => {
                arr.push({
                    nft_name: data.nft_nft_name,
                    nft_desc: data.nft_nft_description,
                    nft_price : data.nft_nft_price,
                    nft_image_link: data.nft_nft_image_link
                })
            }
            );
            // console.log(newArr);
            return {arr};
        }
        else{
            return {
                message: "No data found...!"
            }
        }
    }

    async NFTOwnerUpdate(current_owner : string, updated_owner:User){
        // if updatedUser === 0 then there is no nft belonging to current_owner;

        
        const updatedUser = await this.createQueryBuilder("nft")
        .update()
        .set({ current_owner: updated_owner })
        .where("nft.userId= :userId",{userId:current_owner})
        .execute();
        console.log(updatedUser);
        if(updatedUser.affected === 1){
            return {
                status: "success",
                message: "NFT Owner Changed Successfully :)"
            }
        }
        else{
            throw new InternalServerErrorException("Current Owner is not updated: Error in nft-repostiory file");
        }
    }

    async NFTTransaction(senderUserId:string,receiverUserId:string,NFTPrice:number,NFTId:string){
        const transaction = await Transaction.createQueryBuilder()
        .insert()
        .into('transaction')
        .values([{sender:senderUserId,receiver:receiverUserId,amount:NFTPrice,nft_id:NFTId}])
        .execute();
        
        if(transaction){
           return {
            status: "success",
            message: "Transaction stored successfully :)"
           }
        }
        else{
            throw new InternalServerErrorException("Error : NfT-repository page");
        }
    }
}
