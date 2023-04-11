import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { NFTCategory } from "../enums/nft-category.enum";
import { Transaction } from "./transaction-nft.entity";
import { Users } from "./user.entity";

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

    @Column({unique:true})
    nft_image_link: string;
    
    
    @ManyToOne(()=>Users,user=>user.nft)
    @JoinColumn({name:"userid"})
    user: Users;
    
    @Column()
    category : NFTCategory;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)",name: "createdAt"})
    created_at: Date;

    @ManyToOne(()=>Users,user=>user.nft)
    @JoinColumn({name:"mint_by"})
    mint_by: Users;

    @ManyToOne(()=>Users,user=>user.nft)
    @JoinColumn({name:"current_owner"})
    current_owner: Users;
}