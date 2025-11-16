import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";

@Entity("auth_tokens")
export class AuthTokenEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    token: string;

    @Column({ type: "timestamp" })
    expiresAt: Date;

    @Column({ default: false })
    revoked: boolean;
}