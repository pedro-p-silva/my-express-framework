import {Repository} from "typeorm";
import {UserEntity} from "../entities/user.entity";
import {AppDataSource} from "../../../database/data-source";

export interface IUserRepository extends Repository<UserEntity> {
    findByEmail(email: string): Promise<UserEntity | null>;
    existsByEmail(email: string): Promise<boolean>;
}

export async function UserRepository(): Promise<IUserRepository> {
    const ds = AppDataSource.isInitialized
        ? AppDataSource
        : await AppDataSource.initialize();

    const baseRepo = ds.getRepository(UserEntity);

    return baseRepo.extend({
        async findByEmail(email: string) {
            return await baseRepo.findOne({ where: { email } });
        },

        async existsByEmail(email: string) {
            return await baseRepo.exists({where: {email}});
        }
    }) as IUserRepository;
}