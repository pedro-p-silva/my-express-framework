import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { LoginSchema } from "../dto/login.schema";
import {AuthTokenRepository} from "../repositories/auth-token.repository";
import {TokenService} from "../services/token.service";

export class AuthController {
    private service = new AuthService();

    async login(req: Request, res: Response) {
        const parsed = LoginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: parsed.error.flatten()
            });
        }

        const result = await this.service.login(parsed.data);
        return res.json(result);
    }

    async refresh(req: Request, res: Response) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: "Missing refreshToken" });
        }

        const repo = await AuthTokenRepository();
        const isValid = await repo.isValid(refreshToken);

        if (!isValid) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        const payload = TokenService.verifyRefreshToken(refreshToken);

        if (!payload) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        await repo.invalidateToken(refreshToken);

        const userId = payload.sub;

        const newAccess = TokenService.generateAccessToken({ id: userId } as any);
        const newRefresh = await TokenService.generateRefreshToken({ id: userId } as any);

        return res.json({
            accessToken: newAccess,
            refreshToken: newRefresh
        });
    }
}
