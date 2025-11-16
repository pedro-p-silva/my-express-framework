import { AuthTokenEntity } from "../entities/auth-token.entity";
import { AppDataSource } from "../../../database/data-source";

export async function AuthTokenRepository() {
    const ds = await AppDataSource.initialize().catch(() => AppDataSource);
    const repo = ds.getRepository(AuthTokenEntity);

    return repo.extend({
        async createToken(id: string, token: string, expiresAt: Date) {
            const r = repo.create({ id, token, expiresAt });
            return repo.save(r);
        },

        async invalidateToken(token: string) {
            await repo.update({ token }, { revoked: true });
        },

        async isValid(token: string) {
            const t = await repo.findOne({ where: { token, revoked: false } });
            if (!t) return false;
            return t.expiresAt > new Date();
        }
    });
}