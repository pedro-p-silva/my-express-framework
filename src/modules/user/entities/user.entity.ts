import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import {AuditModel} from "../../../database/audit.model";

@Entity("users")
export class UserEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column(() => AuditModel, {prefix: false})
    AuditModel;
}