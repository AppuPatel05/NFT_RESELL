import { BadRequestException, PipeTransform } from "@nestjs/common";
import { NFTCategory } from "../enums/nft-category.enum";

export class NFTCategoryValidationPipe implements PipeTransform{

    readonly allowedStates = [
        NFTCategory.art,
        NFTCategory.gaming,
        NFTCategory.meme
    ];

    transform(value: any) {
        if(!this.isStatusValid(value)){
            throw new BadRequestException();
        }
        return value;
    }

    private isStatusValid(status:any){
        // console.log(status);
        const idx= this.allowedStates.indexOf(status);
        
        return idx !== -1;
    }
}