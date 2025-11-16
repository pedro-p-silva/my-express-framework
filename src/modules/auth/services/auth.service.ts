import argon2 from "argon2";
import { LoginDto } from "../dto/login.dto";
import { UserRepository } from "../../user/repositories/user.repository";
import { TokenService } from "./token.service";

export class AuthService {

    // tokenService = new TokenService();

    async login(data: LoginDto) {
        const repo = await UserRepository();

        const user = await repo.findByEmail(data.email);
        if (!user) {
            throw new Error("Invalid credentials.");
        }

        const validPassword = await argon2.verify(user.password, data.password);
        if (!validPassword) {
            throw new Error("Invalid credentials.");
        }

        return {
            accessToken: TokenService.generateAccessToken(user),
            refreshToken: TokenService.generateRefreshToken(user),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        };
    }
}