import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { NFT } from "./nft-mint.entity";

@Entity()
export class Transaction extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    transaction_id: string;

    @Column()
    sender:string;

    @Column()
    receiver: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)",name: "created_at"})
    created_at: Date;

    @Column({name:"amount"})
    amount:number;

    @Column("uuid")
    nft_id: string;
}