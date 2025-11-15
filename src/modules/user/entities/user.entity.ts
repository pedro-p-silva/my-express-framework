import { Entity, Column } from "typeorm";
import { BaseModel } from "../../shared/base.model";

@Entity("users")
export class UserEntity extends BaseModel {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;
}