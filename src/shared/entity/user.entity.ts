import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { UserRole } from "../enums/user-role.enum";
import * as bcrypt from "bcrypt";
import { NFT } from "./nft-mint.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn('uuid')
    userid: string;

    @Column()
    username: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()   
    role: UserRole;

    @Column('boolean',{default: false})
    is_verified: boolean;

    @Column('boolean',{default: false})
    is_deleted: boolean;

    @Column()
    salt: string;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)",name: "createdAt"})
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;

    
    @Column('text',{default:null,unique:true})
    metamask_address : string;


    @OneToMany(()=>NFT,(nft)=>{nft.user,nft.current_owner})
    nft : NFT[];

    async validatePassword(password: string) : Promise<boolean>{
        const hash = await bcrypt.hash(password,this.salt);
        return hash === this.password;
    }
}