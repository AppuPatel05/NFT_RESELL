import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { Users } from "src/shared/entity/user.entity";

export class UpdateOwnerDto{

    @IsNotEmpty()
    senderUser:Users;

    
    @IsNotEmpty()
    receiverUser:Users;


    @IsNotEmpty()
    nft : string;

}