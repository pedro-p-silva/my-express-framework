import { Column } from "typeorm";

export class AuditModel {
    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @Column({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    updatedAt: Date;

    @Column({ name: "deleted_at", type: "timestamp", nullable: true })
    deletedAt: Date | null;
}