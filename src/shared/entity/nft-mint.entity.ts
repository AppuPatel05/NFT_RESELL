import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class NFT extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    nft_id: string;

    @Column()
    nft_name: string;

    @Column()
    nft_description: string;

    @Column()
    nft_price: number;

    @Column()
    nft_image_link: string;

    @ManyToOne(()=>User,user=>user.nft)
    @JoinColumn({name:"user"})
    user: User;
}