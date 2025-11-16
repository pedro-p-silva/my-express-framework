import { UserEntity } from "../entities/user.entity";
import { UserResponseDto} from "../dto/user-response";

export class UserMapper {
    static toResponse(entity: UserEntity): UserResponseDto {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
            createdAt: entity.AuditModel.createdAt,
            updatedAt: entity.AuditModel.updatedAt,
            deletedAt: entity.AuditModel.deletedAt,
        };
    }
}