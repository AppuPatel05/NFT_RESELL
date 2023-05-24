import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Users } from "src/shared/entity/user.entity";

export class NFTBalanceDTO{

    @IsNotEmpty()
    nft_json_link:string;

    @IsNotEmpty()
    total_balance: string;

}