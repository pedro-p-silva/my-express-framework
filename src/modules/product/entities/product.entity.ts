import {Entity, Column, PrimaryGeneratedColumn} from "typeorm";
import {AuditModel} from "../../../database/audit.model";

@Entity("products")
export class ProductEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name?: string;

  @Column(() => AuditModel)
  audit: AuditModel;
}