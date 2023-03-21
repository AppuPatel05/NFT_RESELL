import { EntityRepository, Repository } from "typeorm";
import { NFT } from "../shared/entity/nft-mint.entity";

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
}