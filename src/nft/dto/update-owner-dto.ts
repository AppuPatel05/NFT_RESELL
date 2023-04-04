import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { User } from "src/shared/entity/user.entity";

export class UpdateOwnerDto{

    @IsNotEmpty()
    senderUser:User;

    
    @IsNotEmpty()
    receiverUser:User;


    @IsNotEmpty()
    nft : string;

}