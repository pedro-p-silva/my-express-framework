import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { ensureConnection } from "../../../database/connection";

export interface IUserRepository extends Repository<UserEntity> {
    findByEmail(email: string): Promise<UserEntity | null>;
    existsByEmail(email: string): Promise<boolean>;
}

export async function UserRepository(): Promise<IUserRepository> {
    const ds = await ensureConnection();
    const baseRepo = ds.getRepository(UserEntity);

    return baseRepo.extend({
        async findByEmail(email: string) {
            return baseRepo.findOne({ where: { email } });
        },

        async existsByEmail(email: string) {
            return baseRepo.exists({ where: { email } });
        }
    }) as IUserRepository;
}