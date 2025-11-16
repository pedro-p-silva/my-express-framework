import { Router } from "express";
import { AuthController } from "./controllers/auth.controller";

export const authRouter = Router();
const controller = new AuthController();

authRouter.post("/login", controller.login.bind(controller));
authRouter.post("/refresh", controller.refresh.bind(controller));
