import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { UserEntity } from "../../user/entities/user.entity";
import { AuthTokenRepository } from "../repositories/auth-token.repository";

export class TokenService {
    static generateAccessToken(user: UserEntity) {
        return jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET,
            { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions
        );
    }

    static async generateRefreshToken(user: UserEntity) {
        const token = jwt.sign(
            { id: user.id },
            env.JWT_REFRESH_SECRET,
            { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
        );

        const repo = await AuthTokenRepository();

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await repo.createToken(user.id, token, expiresAt);
        return token;
    }

    static verifyRefreshToken(token: string) {
        try {
            return jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string };
        } catch {
            return null;
        }
    }
}