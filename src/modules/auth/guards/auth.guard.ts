import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { UserRepository } from "../../user/repositories/user.repository";

export async function authGuard(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    let token = ""

    if (!header?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (header != null) {
         token = header.split(" ")[1];
    }

    try {
        const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string };

        const repo = await UserRepository();
        const user = await repo.findOne({ where: { id: payload.sub } });

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        (req as any).user = user;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}