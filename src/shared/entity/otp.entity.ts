import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class OTP extends BaseEntity{

    @PrimaryGeneratedColumn('uuid')
    otpid: string;

    @Column()
    userid: string;

    @Column()
    email: string;

    @Column()
    otp: number;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)",name:"created_at" })
    createdAt: Date;

    @Column()
    isDeleted : Boolean;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", name: 'updated_at'})
    updatedAt : Date;

    @Column({type: "timestamp" ,nullable:true})
    expiredAt : Date;
}